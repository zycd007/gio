# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

光里光外（GIO）— 空间智能照明设计官网及后台管理系统。

- **后端**: Spring Boot 3.2.0 + MyBatis Plus 3.5.5 + MySQL（单体架构，端口 8081）
- **前端**: React 18 + TypeScript + Vite 6 + Tailwind CSS（开发端口 5173）
- **Java**: 17（必须使用 ms-17.0.17）

## 常用命令

```bash
# 设置 JAVA_HOME（每次新终端必须执行）
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17" && export PATH="$JAVA_HOME/bin:$PATH"

# 后端构建 + 启动
cd gio && mvn clean install -DskipTests && cd gio-api && mvn spring-boot:run

# 后端运行测试
mvn test

# 前端开发
cd gio-web && pnpm install && pnpm dev

# 前端构建
cd gio-web && pnpm build

# 运行单个后端测试类
cd gio-api && mvn test -Dtest=ClassName

# 运行单个测试方法
cd gio-api && mvn test -Dtest=ClassName#methodName
```

## 架构要点

### 后端分层

`Controller` → `Service` → `Mapper(BaseMapper)` → `Entity`，遵循 MyBatis Plus 标准分层。

- **C 端控制器**（`/api/**`，无需认证）：`PortalController`、`MessageController`、`ImageController`、`TrackController`
- **管理端控制器**（`/api/admin/**`，需 JWT）：`AdminLoginController`、`DashboardController`、`AdminProjectController`、`AdminCategoryController`、`AdminImageController`、`AdminMessageController`、`SocialPostController`

### 前端路由

- **C 端**（`Layout` 包裹）：`/`（首页）、`/projects`、`/projects/:id`、`/contact`、`/about`
- **管理端**（`AdminLayout` 包裹）：`/admin`（Dashboard）、`/admin/projects`、`/admin/projects/:id`、`/admin/categories`、`/admin/messages`、`/admin/social-posts`

前端无 Redux/Zustand，状态管理使用 React Context（`AppContext` 持有 categories/projects）+ 组件局部 state + localStorage（仅存 admin_token）。

### 图片存储模型（非显而易见）

图片**以 Base64 存储在 `attachment` 表**中（`base64_data` 和 `thumbnail_data` 字段），文件系统仅作为上传/压缩的临时暂存区。读取图片时通过 Caffeine 缓存避免重复 Base64 解码。

**临时图片工作流**：创建项目时先上传图片到 `/api/admin/images/temp`（project_id=null），项目创建后再通过 `/api/admin/projects/{id}/images/associate` 关联，第一张关联图片自动成为封面。

### 认证流程

1. POST `/api/admin/login` → BCrypt 验证 → 返回 JWT（access 24h, refresh 7d）
2. 前端 Axios 拦截器注入 `Authorization: Bearer <token>`
3. `JwtAuthenticationFilter` 验证 token 并设置 `ROLE_ADMIN`
4. 前端 `AdminLayout` 挂载时调 `/api/admin/me` 验证，每 5 分钟轮询
5. 401 响应自动清除 token 并跳转 `/admin/login`

### 软删除不一致

`SocialPost` 使用 MyBatis Plus `@TableLogic` 自动软删除，但 `Project` 使用手动 `deleted` 字段 + 显式 `eq("deleted", 0)` 过滤。新增实体时需注意保持一致性。

## 关键约定

- 统一返回格式 `Result<T>`（code/message/data/timestamp），分页用 `PageResult<T>`
- 实体类用 Lombok `@Data`，主键 `@TableId(type = IdType.AUTO)`
- 时间字段 `created_at`/`updated_at` 由 `MybatisPlusConfig.MetaObjectHandler` 自动填充
- 表名小写+下划线，逻辑删除字段 `deleted`（0/1）
- 前端 API 层在 `services/` 目录，Axios 实例在 `services/api.ts`（自动解包 code===200 返回 data）
- 前端上传使用串行队列（`uploadService.ts`），非并行
- AI 功能通过阿里云 DashScope API（qwen3.5-plus 文本、wanx-v1 图片），超时 60s/120s

## 配置

- **后端配置**: `gio-api/src/main/resources/application.yml`（端口 8081、MySQL、JWT secret、DashScope API key、邮件通知）
- **前端代理**: `gio-web/vite.config.ts` 中 `/api` → `http://localhost:8081`
- **CORS**: `SecurityConfig` 允许 `localhost:5173`、`localhost:3000`、`https://gio-ai.cn`、`http://140.143.87.54`

## 部署

使用本地打包 + SCP 上传方式部署到腾讯云（140.143.87.54），详见 `deploy_upload.py`（上传）和 `deploy_remote.py`（远程重启）。服务器使用 Nginx 反向代理前端。
