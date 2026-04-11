# 小红书推文管理中心 - 设计规范

> 创建日期：2026-04-11
> 状态：待审查

---

## 1. Context（背景与目标）

### 问题陈述
光里光外公司需要一个高效的社交媒体营销工具，用于在小红书等平台推广照明设计业务。之前实现的 AI 文案功能整体不够智能化，流程繁琐，文案质量不佳，无法满足实际营销需求。

### 目标
设计一个"小红书推文管理中心"，实现：
1. **一键智能生成**：AI 自动分析内容，生成完整推文（标题+正文+标签+图片推荐）
2. **双内容来源**：支持从项目生成（项目信息+图片）和自定义创作（手动输入+上传图片）
3. **便捷发布辅助**：提供一键复制文案和图片包下载，简化发布流程
4. **历史管理**：所有生成的推文保存管理，支持编辑、复用、追踪

### 目标受众
- 潜在客户（业主、商业空间负责人）- 获客为主
- 行业从业者 - 品牌建设、专业影响力

---

## 2. Architecture（系统架构）

### 整体架构
```
┌─────────────────────────────────────────────────────────────────┐
│                     后台管理界面 (React + TypeScript)            │
├─────────────────────────────────────────────────────────────────┤
│  推文管理菜单                                                    │
│  ├── 推文列表页 (SocialPosts.tsx)                               │
│  ├── 推文详情页 (SocialPostDetail.tsx)                          │
│  ├── 生成推文弹窗 (GeneratePostModal.tsx)                       │
│  └── 发布辅助组件                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     后端 API 服务 (Spring Boot)                  │
├─────────────────────────────────────────────────────────────────┤
│  SocialPostController                                           │
│  ├── POST /api/admin/social-posts/generate                      │
│  ├── GET  /api/admin/social-posts                               │
│  ├── GET  /api/admin/social-posts/{id}                          │
│  ├── PUT  /api/admin/social-posts/{id}                          │
│  ├── DELETE /api/admin/social-posts/{id}                        │
│  └── GET  /api/admin/social-posts/{id}/export                   │
├─────────────────────────────────────────────────────────────────┤
│  SocialPostService                                              │
│  ├── generateFromProject()                                      │
│  ├── generateFromCustom()                                       │
│  ├── callQwenAPI()                                              │
│  └── exportImages()                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     数据存储 (MySQL)                             │
├─────────────────────────────────────────────────────────────────┤
│  social_post 表                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI 服务 (通义千问 qwen3.5-plus)              │
└─────────────────────────────────────────────────────────────────┘
```

### 数据流
1. 用户选择内容来源（项目或自定义）
2. 系统提取相关信息 → 调用 AI 生成推文
3. 推文保存到数据库
4. 用户查看/编辑 → 使用发布辅助功能

---

## 3. Database（数据库设计）

### 新建表：social_post

```sql
CREATE TABLE social_post (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',

    -- 内容来源
    type VARCHAR(20) NOT NULL COMMENT '类型: project/custom',
    project_id INT NULL COMMENT '关联项目ID',

    -- AI生成内容
    title VARCHAR(100) NOT NULL COMMENT '推文标题',
    content TEXT NOT NULL COMMENT '推文正文',
    tags VARCHAR(500) COMMENT '标签（逗号分隔）',

    -- 图片选择
    selected_images JSON COMMENT '选中的项目图片ID列表',
    custom_images JSON COMMENT '自定义上传的图片信息',

    -- 状态管理
    status TINYINT DEFAULT 0 COMMENT '状态: 0-草稿 1-已发布',
    publish_platform VARCHAR(50) COMMENT '发布平台',
    publish_url VARCHAR(255) COMMENT '发布后的链接',

    -- 时间字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',

    INDEX idx_project_id (project_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) COMMENT '小红书推文记录表';
```

### 关键字段说明
| 字段 | 用途 | JSON格式示例 |
|------|------|--------------|
| selected_images | 项目图片选择 | `[1, 3, 5]` |
| custom_images | 自定义图片 | `[{"id":123,"filename":"img1.jpg"}]` |

---

## 4. Backend API（后端接口）

### 接口清单
| 接口 | 方法 | 路径 | 功能 |
|------|------|------|------|
| 生成推文 | POST | `/api/admin/social-posts/generate` | AI生成 |
| 推文列表 | GET | `/api/admin/social-posts` | 分页查询 |
| 推文详情 | GET | `/api/admin/social-posts/{id}` | 单条详情 |
| 编辑推文 | PUT | `/api/admin/social-posts/{id}` | 修改内容 |
| 删除推文 | DELETE | `/api/admin/social-posts/{id}` | 逻辑删除 |
| 导出图片 | GET | `/api/admin/social-posts/{id}/export` | ZIP下载 |

### 生成推文接口详情

**请求 (SocialPostGenerateRequest)**：
```json
{
  "type": "project",
  "projectId": 15,
  "selectedImageIds": [1, 3, 5]
}
// 或自定义模式
{
  "type": "custom",
  "customContent": "分享照明设计的常见误区...",
  "customImages": []
}
```

**响应 (SocialPostDTO)**：
```json
{
  "id": 1,
  "title": "✨ 打造梦幻灯光氛围的5个秘诀",
  "content": "灯光设计不仅仅是照亮空间...",
  "tags": "照明设计,室内灯光,氛围感",
  "selectedImages": [1, 3, 5],
  "type": "project",
  "projectId": 15,
  "status": 0,
  "createdAt": "2026-04-11T10:00:00"
}
```

### AI Prompt 模板
```java
String prompt = """
你是一个专业的照明设计品牌营销专家。
请根据以下项目信息，生成一篇小红书推文。

【项目信息】
项目名称：%s
项目位置：%s
设计年份：%s
项目描述：%s
分类：%s

【图片描述】
%s

【要求】
1. 标题：吸引眼球，15-25字，可使用emoji
2. 正文：300-500字，第一人称视角，专业但不生硬
3. 标签：5-8个，包含行业词+场景词+风格词
4. 目标受众：潜在客户和行业从业者
5. 调性：专业有感染力，展现公司理念和能力

请生成：
【标题】
【正文】
【标签】
【推荐封面图】
【推荐配图顺序】
""";
```

---

## 5. Frontend（前端界面）

### 页面结构
| 页面 | 路径 | 文件 |
|------|------|------|
| 推文列表 | `/admin/social-posts` | `SocialPosts.tsx` |
| 推文详情 | `/admin/social-posts/:id` | `SocialPostDetail.tsx` |
| 生成弹窗 | 组件 | `GeneratePostModal.tsx` |

### 核心功能流程

**生成推文流程**：
1. 点击"生成新推文" → 打开弹窗
2. 选择来源类型（项目/自定义）
3. 项目模式：选择项目 → 选择图片 → 生成
4. 自定义模式：输入描述 → 上传图片 → 生成
5. 显示生成结果 → 保存草稿或发布辅助

**发布辅助功能**：
- 一键复制文案（标题+正文+标签）
- 下载图片ZIP包（按推荐顺序命名）

---

## 6. Implementation Files（实现文件清单）

### 新建文件

**后端 (gio-api)**：
```
src/main/java/com/gio/
├── entity/SocialPost.java
├── dto/
│   ├── SocialPostGenerateRequest.java
│   ├── SocialPostDTO.java
│   └── SocialPostListItemDTO.java
├── mapper/SocialPostMapper.java
├── service/
│   ├── SocialPostService.java
│   └── impl/SocialPostServiceImpl.java
└── controller/SocialPostController.java
```

**前端 (gio-web)**：
```
src/
├── admin/
│   ├── SocialPosts.tsx
│   ├── SocialPostDetail.tsx
│   └── components/
│       ├── GeneratePostModal.tsx
│       ├── PostSourceSelector.tsx
│       ├── ProjectPostGenerator.tsx
│       └── CustomPostGenerator.tsx
├── services/socialPost.ts
└── types/socialPost.ts
```

### 需修改文件
| 文件 | 修改内容 |
|------|----------|
| `gio-web/src/admin/Layout.tsx` | 添加"推文管理"菜单项 |
| `gio-web/src/App.tsx` | 添加推文管理路由 |
| `gio-api/pom.xml` | 添加 ZIP 打包依赖（如需要） |

---

## 7. Verification（验证方案）

### 功能验证清单
| 功能 | 测试步骤 | 预期结果 |
|------|----------|----------|
| 项目生成推文 | 选择项目 → 点击生成 | 标题+正文+标签自动生成 |
| 自定义生成推文 | 输入描述 → 点击生成 | 根据描述生成相关内容 |
| 推文编辑 | 修改内容 → 保存 | 刷新后显示新内容 |
| 文案复制 | 点击复制按钮 | Toast提示"文案已复制" |
| 图片下载 | 点击下载按钮 | ZIP文件下载成功 |
| 推文筛选 | 选择类型/状态 | 显示对应筛选结果 |

### 端到端测试
1. 从项目生成一条推文
2. 编辑推文并保存
3. 复制文案 + 下载图片包
4. 验证历史推文可正常管理

---

## 8. Technical Constraints（技术约束）

### AI 配置
- 使用现有通义千问配置（qwen3.5-plus）
- API Key: `sk-sp-ccff0d12fb58427ca9e3f09545b5c43d`
- Base URL: `https://coding.dashscope.aliyuncs.com/v1`

### 图片处理
- 图片存储：沿用现有 Attachment 表（Base64存储）
- 图片下载：ZIP打包，使用 Java ZipOutputStream

### 发布限制
- 小红书无官方发布API → 仅提供发布辅助（复制+下载）
- 发布链接由用户手动填写记录

---

## 9. Out of Scope（不在范围内）

- 自动发布到小红书（无官方API）
- 多账号管理
- 推文效果数据分析
- 定时生成功能
- 推文模板自定义