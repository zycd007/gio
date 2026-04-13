# 批量图片上传功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现项目管理批量上传图片功能，支持两个场景（新建项目弹窗、项目详情页），采用串行上传 + 队列组件方案。

**Architecture:** 新增 UploadQueueCard 组件显示上传队列，新增 uploadService.ts 处理串行上传逻辑，修改现有组件集成队列，后端增加 multipart 配置。

**Tech Stack:** React 18 + TypeScript + axios + Tailwind CSS, Spring Boot 3.2 + MyBatis Plus

---

## 文件结构

| 文件 | 操作 | 负责内容 |
|------|------|----------|
| `gio-web/src/types/upload.ts` | 新建 | 上传队列数据类型定义 |
| `gio-web/src/services/uploadService.ts` | 新建 | 串行上传逻辑、AbortController 管理 |
| `gio-web/src/components/UploadQueueCard.tsx` | 新建 | 上传队列卡片组件 |
| `gio-web/src/admin/components/CreateProjectModal.tsx` | 修改 | 集成队列组件 |
| `gio-web/src/admin/ProjectDetailPage.tsx` | 修改 | 集成队列组件 |
| `gio-api/src/main/resources/application.yml` | 修改 | 增加 multipart 配置 |

---

### Task 1: 定义上传队列数据类型

**Files:**
- Create: `gio-web/src/types/upload.ts`

- [ ] **Step 1: 创建 upload.ts 类型定义文件**

```typescript
// gio-web/src/types/upload.ts

/**
 * 上传队列项状态
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed';

/**
 * 上传队列项
 */
export interface UploadQueueItem {
  id: string;                // 唯一标识（使用 Date.now() + index）
  file: File;                // 原始文件对象
  previewUrl: string;        // 预览 URL（File 对象生成的 blob URL）
  status: UploadStatus;      // 上传状态
  progress: number;          // 0-100 进度百分比
  error?: string;            // 失败原因（仅 failed 状态）
  resultId?: number;         // 上传成功后的 imageId（仅 success 状态）
}

/**
 * 上传回调选项
 */
export interface UploadOptions {
  onProgress?: (id: string, progress: number) => void;
  onSuccess?: (id: string, imageId: number) => void;
  onFailed?: (id: string, error: string) => void;
  onComplete?: () => void;   // 所有上传完成回调
}

/**
 * 压缩配置选项
 */
export interface CompressConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
}

/**
 * 默认压缩配置
 */
export const DEFAULT_COMPRESS_CONFIG: CompressConfig = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  maxSizeMB: 2,
};
```

- [ ] **Step 2: 提交类型定义**

```bash
cd E:/my_projects/gio
git add gio-web/src/types/upload.ts
git commit -m "$(cat <<'EOF'
feat: 新增上传队列数据类型定义

- UploadQueueItem 队列项结构
- UploadStatus 状态枚举
- UploadOptions 回调接口
- CompressConfig 压缩配置

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: 创建串行上传服务 uploadService.ts

**Files:**
- Create: `gio-web/src/services/uploadService.ts`
- Modify: `gio-web/src/services/admin.ts` (添加单文件上传函数)

- [ ] **Step 1: 在 admin.ts 添加单文件上传函数**

在 `gio-web/src/services/admin.ts` 文件末尾添加：

```typescript
// ========== 单文件上传（用于串行上传） ==========

/**
 * 上传单个临时图片（用于新建项目场景）
 * 返回 imageId
 */
export const uploadSingleTempImage = async (
  file: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<number> => {
  const formData = new FormData();
  formData.append('files', file);
  
  const response = await request.post('/admin/images/temp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
    signal,
  });
  
  // 返回第一个 imageId
  return response[0];
};

/**
 * 上传单个项目图片（用于项目详情场景）
 * 返回 imageId
 */
export const uploadSingleProjectImage = async (
  projectId: number,
  file: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<number> => {
  const formData = new FormData();
  formData.append('files', file);
  
  const response = await request.post(`/admin/projects/${projectId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
    signal,
  });
  
  // 返回第一个 imageId
  return response[0]?.id || response[0];
};
```

- [ ] **Step 2: 创建 uploadService.ts 文件**

```typescript
// gio-web/src/services/uploadService.ts

import { compressImage } from '@/utils/imageCompress';
import { uploadSingleTempImage, uploadSingleProjectImage } from '@/services/admin';
import { UploadQueueItem, UploadOptions, DEFAULT_COMPRESS_CONFIG, UploadStatus } from '@/types/upload';

// AbortController 存储映射（用于取消上传）
const abortControllers: Map<string, AbortController> = new Map();

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建队列项
 */
export function createQueueItem(file: File): UploadQueueItem {
  const id = generateId();
  const previewUrl = URL.createObjectURL(file);
  
  return {
    id,
    file,
    previewUrl,
    status: 'pending',
    progress: 0,
  };
}

/**
 * 更新队列项状态
 */
export function updateQueueItemStatus(
  item: UploadQueueItem,
  status: UploadStatus,
  extra?: { progress?: number; error?: string; resultId?: number }
): UploadQueueItem {
  return {
    ...item,
    status,
    ...extra,
  };
}

/**
 * 压缩并上传单个图片
 */
async function compressAndUpload(
  item: UploadQueueItem,
  isTemp: boolean,
  projectId?: number,
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem> {
  // 创建 AbortController
  const controller = new AbortController();
  abortControllers.set(item.id, controller);
  
  try {
    // 压缩图片
    const compressedResult = await compressImage(item.file, compressConfig);
    const compressedFile = compressedResult.file;
    
    // 上传
    const imageId = isTemp
      ? await uploadSingleTempImage(
          compressedFile,
          (progress) => options.onProgress?.(item.id, progress),
          controller.signal
        )
      : await uploadSingleProjectImage(
          projectId!,
          compressedFile,
          (progress) => options.onProgress?.(item.id, progress),
          controller.signal
        );
    
    // 成功
    abortControllers.delete(item.id);
    options.onSuccess?.(item.id, imageId);
    return updateQueueItemStatus(item, 'success', { progress: 100, resultId: imageId });
    
  } catch (error: any) {
    abortControllers.delete(item.id);
    
    // 如果是取消导致的错误，不标记为失败
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      return updateQueueItemStatus(item, 'pending', { progress: 0 });
    }
    
    // 失败
    const errorMsg = error.message || '上传失败';
    options.onFailed?.(item.id, errorMsg);
    return updateQueueItemStatus(item, 'failed', { error: errorMsg });
  }
}

/**
 * 串行上传临时图片（新建项目场景）
 */
export async function uploadTempImagesSerial(
  items: UploadQueueItem[],
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem[]> {
  const results: UploadQueueItem[] = [...items];
  
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item.status !== 'pending') continue;
    
    // 更新为上传中
    results[i] = updateQueueItemStatus(item, 'uploading');
    
    // 上传
    results[i] = await compressAndUpload(item, true, undefined, options, compressConfig);
  }
  
  // 所有完成
  options.onComplete?.();
  return results;
}

/**
 * 串行上传项目图片（项目详情场景）
 */
export async function uploadProjectImagesSerial(
  projectId: number,
  items: UploadQueueItem[],
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem[]> {
  const results: UploadQueueItem[] = [...items];
  
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item.status !== 'pending') continue;
    
    // 更新为上传中
    results[i] = updateQueueItemStatus(item, 'uploading');
    
    // 上传
    results[i] = await compressAndUpload(item, false, projectId, options, compressConfig);
  }
  
  // 所有完成
  options.onComplete?.();
  return results;
}

/**
 * 取消上传
 */
export function cancelUpload(id: string): void {
  const controller = abortControllers.get(id);
  if (controller) {
    controller.abort();
    abortControllers.delete(id);
  }
}

/**
 * 重试单个失败项
 */
export async function retryUploadItem(
  item: UploadQueueItem,
  isTemp: boolean,
  projectId?: number,
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem> {
  // 重置为 pending
  const resetItem = updateQueueItemStatus(item, 'pending', { progress: 0, error: undefined });
  
  // 重新上传
  const uploadingItem = updateQueueItemStatus(resetItem, 'uploading');
  return await compressAndUpload(uploadingItem, isTemp, projectId, options, compressConfig);
}

/**
 * 清理预览 URL（释放内存）
 */
export function cleanupPreviewUrls(items: UploadQueueItem[]): void {
  items.forEach(item => {
    if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
}
```

- [ ] **Step 3: 提交上传服务**

```bash
cd E:/my_projects/gio
git add gio-web/src/services/uploadService.ts gio-web/src/services/admin.ts
git commit -m "$(cat <<'EOF'
feat: 新增串行上传服务 uploadService

- createQueueItem 创建队列项
- uploadTempImagesSerial 串行上传临时图片
- uploadProjectImagesSerial 串行上传项目图片
- cancelUpload 取消上传（AbortController）
- retryUploadItem 重试失败项
- admin.ts 添加单文件上传函数

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: 创建 UploadQueueCard 组件

**Files:**
- Create: `gio-web/src/components/UploadQueueCard.tsx`

- [ ] **Step 1: 创建 UploadQueueCard 组件**

```tsx
// gio-web/src/components/UploadQueueCard.tsx

import { UploadQueueItem } from '@/types/upload';

interface UploadQueueCardProps {
  queue: UploadQueueItem[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onClear: () => void;
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * 状态图标
 */
function StatusIcon({ status }: { status: UploadQueueItem['status'] }) {
  switch (status) {
    case 'success':
      return (
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'failed':
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'uploading':
      return (
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      );
    case 'pending':
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * 上传队列卡片组件
 */
export default function UploadQueueCard({ queue, onCancel, onRetry, onClear }: UploadQueueCardProps) {
  if (queue.length === 0) return null;

  // 统计各状态数量
  const successCount = queue.filter(item => item.status === 'success').length;
  const failedCount = queue.filter(item => item.status === 'failed').length;
  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const uploadingCount = queue.filter(item => item.status === 'uploading').length;

  return (
    <div className="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* 标题栏 */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          上传队列
          <span className="ml-2 text-xs">
            ({successCount}张成功, {failedCount}张失败, {pendingCount}张等待)
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-500 transition-colors"
        >
          清空队列
        </button>
      </div>

      {/* 队列列表 */}
      <div className="max-h-48 overflow-y-auto">
        {queue.map((item) => (
          <div
            key={item.id}
            className="px-3 py-2 flex items-center gap-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
          >
            {/* 缩略图预览 */}
            <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 文件信息 */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-700 truncate">{item.file.name}</div>
              <div className="text-xs text-slate-400">{formatFileSize(item.file.size)}</div>
              
              {/* 失败时显示错误信息 */}
              {item.status === 'failed' && item.error && (
                <div className="text-xs text-red-500 truncate">{item.error}</div>
              )}
            </div>

            {/* 进度条 */}
            <div className="flex-shrink-0 w-20">
              {item.status === 'uploading' || item.status === 'success' ? (
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.status === 'success' ? 'bg-emerald-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-right">
                  {item.status === 'pending' ? '等待中...' : ''}
                </div>
              )}
            </div>

            {/* 状态图标 */}
            <div className="flex-shrink-0">
              <StatusIcon status={item.status} />
            </div>

            {/* 操作按钮 */}
            <div className="flex-shrink-0">
              {item.status === 'uploading' && (
                <button
                  onClick={() => onCancel(item.id)}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors px-1"
                >
                  取消
                </button>
              )}
              {item.status === 'failed' && (
                <button
                  onClick={() => onRetry(item.id)}
                  className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors px-1"
                >
                  重试
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 上传中提示 */}
      {uploadingCount > 0 && (
        <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-emerald-600">
            正在上传... 请等待完成后保存项目
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交队列组件**

```bash
cd E:/my_projects/gio
git add gio-web/src/components/UploadQueueCard.tsx
git commit -m "$(cat <<'EOF'
feat: 新增 UploadQueueCard 上传队列组件

- 显示上传队列列表（缩略图、文件名、进度）
- 支持 4 种状态：pending/uploading/success/failed
- 取消上传中项、重试失败项、清空队列
- 卡片式内嵌设计

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 修改后端 application.yml 配置

**Files:**
- Modify: `gio-api/src/main/resources/application.yml:4-8`

- [ ] **Step 1: 添加 multipart 配置**

在 `gio-api/src/main/resources/application.yml` 的 `spring:` 配置块中添加 multipart 配置（在 `datasource` 配置后）：

```yaml
spring:
  application:
    name: gio-api

  servlet:
    multipart:
      max-file-size: 10MB        # 单文件最大 10MB
      max-request-size: 100MB    # 单请求最大 100MB
      file-size-threshold: 0     # 不使用临时文件缓存

  datasource:
    # ... 保留原有 datasource 配置
```

完整修改位置：在第 4-7 行 `application:` 配置后，第 8 行 `datasource:` 配置前插入 `servlet:` 配置块。

- [ ] **Step 2: 提交配置修改**

```bash
cd E:/my_projects/gio
git add gio-api/src/main/resources/application.yml
git commit -m "$(cat <<'EOF'
feat: 增加 Spring Boot multipart 上传配置

- max-file-size: 10MB 单文件限制
- max-request-size: 100MB 单请求限制
- 为批量上传提供大小兜底保障

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: 修改 CreateProjectModal.tsx 集成队列组件

**Files:**
- Modify: `gio-web/src/admin/components/CreateProjectModal.tsx`

- [ ] **Step 1: 导入新组件和服务**

在文件顶部导入区域添加：

```typescript
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  createProject,
  associateImagesToProject,
  getCategories,
} from '@/services/admin';
import UploadQueueCard from '@/components/UploadQueueCard';
import {
  createQueueItem,
  uploadTempImagesSerial,
  cancelUpload,
  retryUploadItem,
  cleanupPreviewUrls,
} from '@/services/uploadService';
import { UploadQueueItem } from '@/types/upload';
```

删除原有的 `uploadTempImages` 和 `compressImages` 导入。

- [ ] **Step 2: 替换状态管理**

找到第 38-39 行的现有状态：

```typescript
// 暂存的临时图片
const [pendingTempImageIds, setPendingTempImageIds] = useState<number[]>([]);
const [pendingImageFiles, setPendingImageFiles] = useState<{ id: number; file: File }[]>([]);
```

替换为：

```typescript
// 上传队列
const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
const [isUploading, setIsUploading] = useState(false);
const [uploadedImageIds, setUploadedImageIds] = useState<number[]>([]);
```

- [ ] **Step 3: 替换 resetForm 函数**

找到第 54-65 行的 `resetForm` 函数，替换为：

```typescript
// 重置表单
const resetForm = () => {
  setFormData({
    name: '',
    location: '',
    year: '',
    categoryId: categories.length > 0 ? categories[0].id : 1,
    description: '',
    status: 0,  // 保持草稿状态
  });
  // 清理预览 URL
  cleanupPreviewUrls(uploadQueue);
  setUploadQueue([]);
  setUploadedImageIds([]);
  setIsUploading(false);
};
```

- [ ] **Step 4: 替换上传逻辑**

找到第 68-110 行的 `handleUploadTempImages` 函数，替换为：

```typescript
// 处理文件选择
const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // 创建队列项
  const newItems = Array.from(files).map(file => createQueueItem(file));
  setUploadQueue(prev => [...prev, ...newItems]);

  // 开始上传
  setIsUploading(true);

  const updatedQueue = await uploadTempImagesSerial([...uploadQueue, ...newItems], {
    onProgress: (id, progress) => {
      setUploadQueue(prev =>
        prev.map(item =>
          item.id === id ? { ...item, progress } : item
        )
      );
    },
    onSuccess: (id, imageId) => {
      setUploadedImageIds(prev => [...prev, imageId]);
    },
    onFailed: (id, error) => {
      toast.error(`上传失败: ${error}`);
    },
    onComplete: () => {
      setIsUploading(false);
      toast.success('所有图片上传完成');
    },
  });

  setUploadQueue(updatedQueue);

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};
```

- [ ] **Step 5: 添加取消和重试处理函数**

在 `handleFileSelect` 函数后添加：

```typescript
// 取消上传
const handleCancelUpload = (id: string) => {
  cancelUpload(id);
  setUploadQueue(prev =>
    prev.map(item =>
      item.id === id ? { ...item, status: 'pending', progress: 0 } : item
    )
  );
};

// 重试上传
const handleRetryUpload = async (id: string) => {
  const item = uploadQueue.find(i => i.id === id);
  if (!item || item.status !== 'failed') return;

  setIsUploading(true);

  const updatedItem = await retryUploadItem(item, true, undefined, {
    onProgress: (progressId, progress) => {
      setUploadQueue(prev =>
        prev.map(i =>
          i.id === progressId ? { ...i, progress } : i
        )
      );
    },
    onSuccess: (successId, imageId) => {
      setUploadedImageIds(prev => [...prev, imageId]);
    },
    onFailed: (failedId, error) => {
      toast.error(`重试失败: ${error}`);
    },
  });

  setUploadQueue(prev =>
    prev.map(i => i.id === id ? updatedItem : i)
  );
  setIsUploading(false);
};

// 清空队列
const handleClearQueue = () => {
  cleanupPreviewUrls(uploadQueue);
  setUploadQueue([]);
  setUploadedImageIds([]);
};
```

- [ ] **Step 6: 替换保存项目逻辑**

找到第 119-151 行的 `handleSave` 函数，替换为：

```typescript
// 保存项目
const handleSave = async () => {
  if (!formData.name.trim()) {
    toast.error('请输入项目名称');
    return;
  }
  if (!formData.year) {
    toast.error('请输入项目年份');
    return;
  }
  if (isUploading) {
    toast.warning('请等待图片上传完成');
    return;
  }

  setSaving(true);
  try {
    const newProject = await createProject(formData);

    // 关联已上传成功的图片
    const successfulIds = uploadQueue
      .filter(item => item.status === 'success' && item.resultId)
      .map(item => item.resultId!);
    
    // 合并之前收集的 imageIds 和队列中成功的 imageIds
    const allImageIds = [...uploadedImageIds, ...successfulIds];
    
    if (allImageIds.length > 0) {
      try {
        await associateImagesToProject(newProject.id, allImageIds);
      } catch (err: any) {
        toast.error('图片关联失败：' + err.message);
      }
    }

    toast.success('项目创建成功');
    resetForm();
    onSuccess();
    onClose();
  } catch (err: any) {
    toast.error('创建失败：' + err.message);
  } finally {
    setSaving(false);
  }
};
```

- [ ] **Step 7: 替换 UI 渲染**

找到第 224-293 行的图片上传区域 JSX，替换为：

```tsx
{/* 项目图片 */}
<div>
  <label className="block text-sm text-slate-600 mb-1">项目图片</label>
  <div
    className="relative border border-slate-200 rounded-lg p-3 bg-slate-50"
  >
    <div className="flex items-center gap-3">
      {/* 上传按钮 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex-shrink-0"
      >
        {isUploading ? (
          <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        ) : (
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* 已上传成功的图片预览 */}
      {uploadQueue.filter(item => item.status === 'success').length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {uploadQueue
            .filter(item => item.status === 'success')
            .slice(0, 8)
            .map((item) => (
              <div
                key={item.id}
                className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0"
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          }
          {uploadQueue.filter(item => item.status === 'success').length > 8 && (
            <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500 flex-shrink-0">
              +{uploadQueue.filter(item => item.status === 'success').length - 8}
            </div>
          )}
        </div>
      )}
    </div>

    {/* 上传队列卡片 */}
    <UploadQueueCard
      queue={uploadQueue}
      onCancel={handleCancelUpload}
      onRetry={handleRetryUpload}
      onClear={handleClearQueue}
    />
  </div>
</div>
```

- [ ] **Step 8: 更新保存按钮禁用逻辑**

找到第 322 行的保存按钮 `disabled={saving}`，改为：

```tsx
disabled={saving || isUploading}
```

- [ ] **Step 9: 提交 CreateProjectModal 修改**

```bash
cd E:/my_projects/gio
git add gio-web/src/admin/components/CreateProjectModal.tsx
git commit -m "$(cat <<'EOF'
feat: CreateProjectModal 集成批量上传队列

- 替换原有上传逻辑为串行上传
- 集成 UploadQueueCard 队列组件
- 支持取消、重试、清空队列
- 上传中禁用保存按钮
- 移除旧的 pendingImageFiles 状态

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: 修改 ProjectDetailPage.tsx 集成队列组件

**Files:**
- Modify: `gio-web/src/admin/ProjectDetailPage.tsx`

- [ ] **Step 1: 导入新组件和服务**

在文件顶部（第 1-25 行附近）添加导入：

```typescript
import UploadQueueCard from '@/components/UploadQueueCard';
import {
  createQueueItem,
  uploadTempImagesSerial,
  uploadProjectImagesSerial,
  cancelUpload,
  retryUploadItem,
  cleanupPreviewUrls,
} from '@/services/uploadService';
import { UploadQueueItem } from '@/types/upload';
```

删除原有的 `compressImages` 导入。

- [ ] **Step 2: 添加上传队列状态**

在第 167 行 `const [uploading, setUploading] = useState(false);` 后添加：

```typescript
// 批量上传队列
const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
const [isBatchUploading, setIsBatchUploading] = useState(false);
```

- [ ] **Step 3: 替换 handleImageUpload 函数**

找到第 297-339 行的 `handleImageUpload` 函数，替换为：

```typescript
// 图片上传（现有项目）- 批量串行上传
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // 检查是否有有效的项目 ID
  if (!projectId || projectId <= 0) {
    toast.error('请先保存项目后再上传图片');
    return;
  }

  // 创建队列项
  const newItems = Array.from(files).map(file => createQueueItem(file));
  setUploadQueue(prev => [...prev, ...newItems]);

  // 开始上传
  setIsBatchUploading(true);

  const updatedQueue = await uploadProjectImagesSerial(projectId, [...uploadQueue, ...newItems], {
    onProgress: (id, progress) => {
      setUploadQueue(prev =>
        prev.map(item =>
          item.id === id ? { ...item, progress } : item
        )
      );
    },
    onSuccess: (id, imageId) => {
      toast.success('图片上传成功');
    },
    onFailed: (id, error) => {
      toast.error(`上传失败: ${error}`);
    },
    onComplete: () => {
      setIsBatchUploading(false);
      loadProject(); // 刷新项目图片列表
    },
  });

  setUploadQueue(updatedQueue);

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};
```

- [ ] **Step 4: 替换 handleUploadTempImages 函数**

找到第 342-388 行的 `handleUploadTempImages` 函数，替换为：

```typescript
// 新建项目时上传临时图片 - 批量串行上传
const handleUploadTempImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // 创建队列项
  const newItems = Array.from(files).map(file => createQueueItem(file));
  setUploadQueue(prev => [...prev, ...newItems]);

  // 开始上传
  setIsBatchUploading(true);

  const updatedQueue = await uploadTempImagesSerial([...uploadQueue, ...newItems], {
    onProgress: (id, progress) => {
      setUploadQueue(prev =>
        prev.map(item =>
          item.id === id ? { ...item, progress } : item
        )
      );
    },
    onSuccess: (id, imageId) => {
      // 更新暂存的图片 ID 列表
      setPendingTempImageIds(prev => [...prev, imageId]);
      
      // 更新预览文件列表
      const item = newItems.find(i => i.id === id);
      if (item) {
        setPendingImageFiles(prev => [...prev, { id: imageId, file: item.file }]);
      }
    },
    onFailed: (id, error) => {
      toast.error(`上传失败: ${error}`);
    },
    onComplete: () => {
      setIsBatchUploading(false);
      toast.success(`已上传 ${files.length} 张图片`);
    },
  });

  setUploadQueue(updatedQueue);

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};
```

- [ ] **Step 5: 添加取消和重试处理函数**

在 `handleUploadTempImages` 函数后添加：

```typescript
// 取消上传
const handleCancelUpload = (id: string) => {
  cancelUpload(id);
  setUploadQueue(prev =>
    prev.map(item =>
      item.id === id ? { ...item, status: 'pending', progress: 0 } : item
    )
  );
};

// 重试上传
const handleRetryUpload = async (id: string) => {
  const item = uploadQueue.find(i => i.id === id);
  if (!item || item.status !== 'failed') return;

  setIsBatchUploading(true);

  // 判断是临时上传还是项目上传
  const isTemp = pageMode === 'createMode' || !projectId;
  const projId = isTemp ? undefined : projectId;

  const updatedItem = await retryUploadItem(item, isTemp, projId, {
    onProgress: (progressId, progress) => {
      setUploadQueue(prev =>
        prev.map(i =>
          i.id === progressId ? { ...i, progress } : i
        )
      );
    },
    onSuccess: (successId, imageId) => {
      if (isTemp) {
        setPendingTempImageIds(prev => [...prev, imageId]);
        setPendingImageFiles(prev => [...prev, { id: imageId, file: item.file }]);
      }
      toast.success('重试成功');
    },
    onFailed: (failedId, error) => {
      toast.error(`重试失败: ${error}`);
    },
  });

  setUploadQueue(prev =>
    prev.map(i => i.id === id ? updatedItem : i)
  );
  
  if (!isTemp && updatedItem.status === 'success') {
    loadProject(); // 刷新项目图片列表
  }
  
  setIsBatchUploading(false);
};

// 清空队列
const handleClearQueue = () => {
  cleanupPreviewUrls(uploadQueue);
  setUploadQueue([]);
};
```

- [ ] **Step 6: 在新建项目模式下渲染队列组件**

找到第 732-805 行的新建项目图片上传区域，在 `{uploading && (...)}` 部分之后添加：

```tsx
{/* 上传队列卡片 */}
<UploadQueueCard
  queue={uploadQueue}
  onCancel={handleCancelUpload}
  onRetry={handleRetryUpload}
  onClear={handleClearQueue}
/>
```

删除原有的 `{uploading && (...)}` 加载提示部分（因为队列组件已包含上传中提示）。

- [ ] **Step 7: 在编辑模式下渲染队列组件**

找到第 983-1036 行的现有项目图片区域，在 `<DndContext>` 组件之前添加：

```tsx
{/* 上传队列卡片 */}
{uploadQueue.length > 0 && (
  <div className="mb-4">
    <UploadQueueCard
      queue={uploadQueue}
      onCancel={handleCancelUpload}
      onRetry={handleRetryUpload}
      onClear={handleClearQueue}
    />
  </div>
)}
```

- [ ] **Step 8: 提交 ProjectDetailPage 修改**

```bash
cd E:/my_projects/gio
git add gio-web/src/admin/ProjectDetailPage.tsx
git commit -m "$(cat <<'EOF'
feat: ProjectDetailPage 集成批量上传队列

- 新建模式和编辑模式均支持批量上传
- 集成 UploadQueueCard 队列组件
- 支持取消、重试、清空队列
- 上传完成后自动刷新项目图片列表

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: 验证功能并修复问题

- [ ] **Step 1: 启动前端开发服务器**

```bash
cd E:/my_projects/gio/gio-web
pnpm dev
```

访问 http://localhost:5173/admin/

- [ ] **Step 2: 测试新建项目批量上传**

1. 点击「新建项目」按钮
2. 选择 5+ 张图片
3. 观察队列显示、进度更新、状态变化
4. 验证取消、重试、清空功能
5. 保存项目，验证图片正确关联

- [ ] **Step 3: 测试项目详情页批量上传**

1. 进入任意项目详情页
2. 点击编辑模式
3. 选择 5+ 张图片上传
4. 验证队列显示和上传完成刷新
5. 验证新图片出现在列表中

- [ ] **Step 4: 修复发现的问题**

如有问题，根据具体错误进行修复并提交。

- [ ] **Step 5: 最终提交**

```bash
cd E:/my_projects/gio
git status
# 确保无未提交修改
git log --oneline -10
# 查看最近提交历史
```

---

## 验收清单

- [ ] 队列正确显示所有选中图片
- [ ] 每张图片独立上传，进度实时更新（0% → 100%）
- [ ] 失败项显示错误信息，可单独重试
- [ ] 上传中项可取消，取消后状态恢复 pending
- [ ] 清空队列功能正常
- [ ] 上传完成后，图片正确关联到项目
- [ ] 新建项目保存时，临时图片正确关联
- [ ] 项目详情页上传后，图片列表自动刷新