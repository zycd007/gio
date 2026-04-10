---
name: AI 小红书文案生成功能实现
description: 2026-04-02 实现的 AI 一键生成小红书文案功能，包含后端服务、前端组件和 API 集成
type: project
---

## AI 小红书文案生成功能

实现时间：2026-04-02

### 功能概述
在管理后台的项目管理模块中，为每个项目添加"AI 一键生成小红书文案"功能，调用通义千问 API 生成符合小红书平台调性的设计类内容文案。

### 技术实现
- **AI 模型**: 通义千问 3.5 Plus (qwen3.5-plus)
- **API 地址**: https://coding.dashscope.aliyuncs.com/v1
- **后端**: gio-admin 模块新增 AiCopywritingService
- **前端**: gio-web 新增 AiCopywritingModal 组件

### 文案风格选项
- professional: 专业权威语气
- seed: 热情种草语气
- story: 叙事性语气
- minimal: 简洁克制语气

### 新增文件
- 后端 DTO: gio-admin/src/main/java/com/gio/dto/AiCopywritingRequest.java
- 后端 DTO: gio-admin/src/main/java/com/gio/dto/AiCopywritingResponse.java
- 后端服务接口：gio-admin/src/main/java/com/gio/service/AiCopywritingService.java
- 后端服务实现：gio-admin/src/main/java/com/gio/service/impl/AiCopywritingServiceImpl.java
- 后端控制器：gio-admin/src/main/java/com/gio/controller/AiCopywritingController.java
- 前端 API 服务：gio-web/src/services/ai.ts
- 前端组件：gio-web/src/admin/components/AiCopywritingModal.tsx

### 修改文件
- gio-admin/pom.xml: 添加 OkHttp、JSON、Lombok 依赖
- gio-admin/application.yml: 添加 AI 配置 (api-key, base-url, model)
- gio-web/src/admin/Projects.tsx: 添加 AI 文案生成入口按钮和弹窗集成

### API 接口
POST /api/admin/projects/{projectId}/ai-copywriting
请求体：{ "style": "professional" }
响应：{ "title": "...", "content": "...", "tags": [...] }
