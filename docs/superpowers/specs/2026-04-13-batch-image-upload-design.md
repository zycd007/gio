# 批量图片上传功能设计文档

## 概述

### 背景
GIO 项目管理功能目前只支持单张图片上传，用户批量选择多张图片时会报错。需要实现批量上传功能，提升用户体验。

### 目标
- 支持两个场景：新建项目弹窗、项目详情页
- 不限制上传数量
- 保持现有 Base64 数据库存储方式
- 显示上传队列，用户可看到进度和状态
- 失败项可重试

### 方案选择
采用 **前端串行上传 + 队列组件** 方案：
- 稳定性最高，每张图片独立处理
- 失败影响范围小
- 队列卡片内嵌在上传区域下方

---

## 架构设计

### 整体架构
```
┌─────────────────────────────────────────────────────────┐
│                    前端 (React + TypeScript)              │
├─────────────────────────────────────────────────────────┤
│  CreateProjectModal.tsx  │  ProjectDetailPage.tsx       │
│         ↓                │           ↓                   │
│  ┌─────────────────────────────────────────┐            │
│  │        UploadQueueCard 组件（新增）       │            │
│  │  - 显示上传队列列表                       │            │
│  │  - 每项显示：文件名、进度、状态            │            │
│  │  - 支持：取消、重试失败项                  │            │
│  └─────────────────────────────────────────┘            │
│         ↓                                                │
│  uploadService.ts（新增）- 串行上传逻辑                   │
├─────────────────────────────────────────────────────────┤
│                    后端 (Spring Boot)                     │
├─────────────────────────────────────────────────────────┤
│  AdminImageController.java（保持不变）                   │
│         ↓                                                │
│  ImageServiceImpl.java（保持不变）                       │
│         ↓                                                │
│  application.yml（增加 multipart 配置）                  │
└─────────────────────────────────────────────────────────┘
```

### 改动文件清单
| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `gio-web/src/components/UploadQueueCard.tsx` | 新增 | 上传队列卡片组件 |
| `gio-web/src/services/uploadService.ts` | 新增 | 串行上传服务逻辑 |
| `gio-web/src/admin/components/CreateProjectModal.tsx` | 修改 | 集成队列组件 |
| `gio-web/src/admin/ProjectDetailPage.tsx` | 修改 | 集成队列组件 |
| `gio-api/src/main/resources/application.yml` | 修改 | 增加 multipart 配置 |

---

## 详细设计

### 1. UploadQueueCard 组件

#### 功能需求
- 显示上传队列列表（卡片式内嵌，在上传按钮下方）
- 每项显示：缩略图预览、文件名、文件大小、上传进度条、状态图标
- 状态类型：等待中(pending)、上传中(uploading)、成功(success)、失败(failed)
- 支持：取消上传中项、重试失败项、清空队列

#### 界面布局
```
┌────────────────────────────────────────────┐
│  上传队列 (3张成功, 1张失败, 2张等待)        │
├────────────────────────────────────────────┤
│  ┌────┐  image1.jpg     ████████ 100%  ✓   │
│  │预览│  1.2MB                                    │
│  └────┘                                              │
│  ┌────┐  image2.jpg     ████████ 100%  ✓   │
│  │预览│  0.8MB                                    │
│  └────┘                                              │
│  ┌────┐  image3.jpg     █████░░░░  60%  ⟳   │
│  │预览│  1.5MB  [取消]                            │
│  └────┘                                              │
│  ┌────┐  image4.jpg     ░░░░░░░░   0%  ✗   │
│  │预览│  2.1MB  [重试]                            │
│  └────┘                                              │
│  ┌────┐  image5.jpg     等待中...      ⏳   │
│  │预览│  0.5MB                                    │
│  └────┘                                              │
├────────────────────────────────────────────┤
│  [清空队列]                                  │
└────────────────────────────────────────────┘
```

#### 数据结构
```typescript
interface UploadQueueItem {
  id: string;                // 唯一标识（使用 UUID 或 timestamp + index）
  file: File;                // 原始文件对象
  previewUrl: string;        // 预览 URL（File 对象生成的 blob URL）
  status: 'pending' | 'uploading' | 'success' | 'failed';
  progress: number;          // 0-100 进度百分比
  error?: string;            // 失败原因（仅 failed 状态）
  resultId?: number;         // 上传成功后的 imageId（仅 success 状态）
}

interface UploadQueueCardProps {
  queue: UploadQueueItem[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onClear: () => void;
}
```

#### 组件 Props
```typescript
interface UploadQueueCardProps {
  queue: UploadQueueItem[];          // 队列列表
  onCancel: (id: string) => void;    // 取消上传回调
  onRetry: (id: string) => void;     // 重试上传回调
  onClear: () => void;               // 清空队列回调
}
```

---

### 2. uploadService 上传服务

#### 核心功能
- 串行上传：逐张上传图片，避免并发压力
- 进度回调：通过 axios onUploadProgress 实时更新进度
- 错误处理：记录失败原因，不中断后续上传
- 可取消：使用 AbortController 支持中途取消

#### 数据结构
```typescript
interface UploadOptions {
  onProgress?: (id: string, progress: number) => void;
  onSuccess?: (id: string, imageId: number) => void;
  onFailed?: (id: string, error: string) => void;
  onComplete?: () => void;  // 所有上传完成回调
  compressOptions?: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    maxSizeMB: number;
  };
}
```

#### API 接口
```typescript
// uploadService.ts

// 创建队列项
function createQueueItem(file: File): UploadQueueItem;

// 串行上传临时图片（新建项目场景）
async function uploadTempImagesSerial(
  items: UploadQueueItem[],
  options: UploadOptions
): Promise<void>;

// 串行上传项目图片（项目详情场景）
async function uploadProjectImagesSerial(
  projectId: number,
  items: UploadQueueItem[],
  options: UploadOptions
): Promise<void>;

// 取消上传（通过 AbortController）
function cancelUpload(id: string): void;

// 重试单个失败项
async function retryUpload(
  item: UploadQueueItem,
  options: UploadOptions
): Promise<void>;
```

#### 上传流程
```
用户选择多张图片
    ↓
createQueueItem() → 添加到队列（全部 status=pending）
    ↓
开始串行上传循环：
    ↓
取第一张 pending 项 → status=uploading
    ↓
compressImages() 厍缩 → uploadTempImage() API → 更新 progress
    ↓
成功 → status=success, 记录 imageId
失败 → status=failed, 记录 error
    ↓
继续下一张 pending 项（直到队列无 pending）
    ↓
onComplete() 回调
```

#### 进度实现
使用 axios 的 `onUploadProgress` 配置获取上传进度：
```typescript
const response = await axios.post(url, formData, {
  onUploadProgress: (progressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded * 100) / (progressEvent.total || 1)
    );
    options.onProgress?.(item.id, percent);
  },
  signal: abortController.signal,  // 支持取消
});
```

---

### 3. 后端 multipart 配置

#### 当前问题
Spring Boot 默认 multipart 配置有限制：
- 单文件大小：默认 1MB
- 总请求大小：默认 10MB

#### 配置修改
在 `gio-api/src/main/resources/application.yml` 中增加：
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB        # 单文件最大 10MB
      max-request-size: 100MB    # 单请求最大 100MB
      file-size-threshold: 0     # 不使用临时文件缓存
```

#### 说明
- 单张压缩后图片通常 < 2MB，10MB 足够
- 串行上传每次只发一张，实际不会触发限制
- 设置宽松配置作为兜底保障

#### 后端代码
后端 Controller 和 Service **不需要改动**，现有 API 已支持单文件上传：
- `POST /api/admin/images/temp` - 临时上传
- `POST /api/admin/projects/{projectId}/images` - 项目上传

---

### 4. CreateProjectModal.tsx 集成

#### 改动点
1. 导入 `UploadQueueCard` 组件和 `uploadService`
2. 添加队列状态：`uploadQueue`、`isUploading`、`uploadedImageIds`
3. 替换 `handleUploadTempImages` 逻辑：
   - 用户选择图片 → 添加到队列 → 自动触发串行上传
   - 上传完成后收集所有 `imageId` 到 `uploadedImageIds`
4. 在上传按钮下方渲染 `UploadQueueCard`
5. 保存按钮禁用状态：上传中时禁用

#### 状态管理
```typescript
const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
const [isUploading, setIsUploading] = useState(false);
const [uploadedImageIds, setUploadedImageIds] = useState<number[]>([]);

// 收集成功的 imageId
const handleUploadSuccess = (id: string, imageId: number) => {
  setUploadedImageIds(prev => [...prev, imageId]);
};

// 所有上传完成
const handleUploadComplete = () => {
  setIsUploading(false);
  // uploadedImageIds 用于后续 createProject
};
```

#### 保存项目逻辑
```typescript
const handleSaveProject = async () => {
  if (isUploading) {
    toast.warning('请等待图片上传完成');
    return;
  }
  
  // 使用 uploadedImageIds 创建项目
  await createProject({ ...projectData, imageIds: uploadedImageIds });
};
```

---

### 5. ProjectDetailPage.tsx 集成

#### 改动点
1. 同样导入组件和服务
2. 添加队列状态管理
3. 替换 `handleImageUpload` 逻辑
4. 在图片列表上方渲染队列组件
5. 上传完成后自动刷新项目图片列表

#### 状态管理
```typescript
const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
const [isUploading, setIsUploading] = useState(false);

// 上传完成后刷新项目数据
const handleUploadComplete = () => {
  setIsUploading(false);
  loadProject();  // 刷新项目图片列表
};
```

---

## 验证方案

### 本地测试步骤
| 测试项 | 测试内容 | 验收标准 |
|--------|----------|----------|
| 单图上传 | 选择 1 张图片 | 队列显示 1 项，进度 0→100%，状态 success |
| 多图上传 | 选择 10+ 张图片 | 队列显示所有项，串行上传，进度实时更新 |
| 失败重试 | 断开网络后上传 | 失败项显示 error，点击重试成功 |
| 取消上传 | 上传中途点击取消 | 当前项中断，状态恢复 pending |
| 大文件 | 选择 5MB+ 图片 | 压缩后上传成功，文件大小显示正确 |
| 边界测试 | 选择 50+ 张图片 | 队列性能正常，无卡顿 |
| 新建项目 | 上传后保存项目 | 图片正确关联到新项目 |
| 项目详情 | 上传后查看项目 | 图片列表显示新上传图片 |

### 验收标准
- [ ] 队列正确显示所有选中图片
- [ ] 每张图片独立上传，进度实时更新（0% → 100%）
- [ ] 失败项显示错误信息，可单独重试
- [ ] 上传中项可取消，取消后状态恢复 pending
- [ ] 清空队列功能正常
- [ ] 上传完成后，图片正确关联到项目
- [ ] 新建项目保存时，临时图片正确关联
- [ ] 项目详情页上传后，图片列表自动刷新

---

## 风险与限制

### 已知限制
1. **Base64 存储**：保持现有存储方式，大量图片仍可能给数据库带来压力（分批上传可缓解）
2. **上传速度**：串行上传较慢，大量图片时用户需等待
3. **浏览器内存**：大量图片预览可能占用内存，建议队列最多显示 20 项预览

### 风险缓解
- 提示用户上传进度和预计时间
- 清空队列功能释放内存
- 失败项可重试，不丢失已成功项

---

## 实现优先级

1. **P0 - 必须实现**
   - uploadService.ts 串行上传逻辑
   - UploadQueueCard 组件
   - application.yml multipart 配置
   - CreateProjectModal.tsx 集成

2. **P1 - 建议实现**
   - ProjectDetailPage.tsx 集成
   - 取消上传功能
   - 重试失败功能

3. **P2 - 可选实现**
   - 队列预览数量限制（性能优化）
   - 上传预计时间提示