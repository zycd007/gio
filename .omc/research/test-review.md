# GIO 项目功能测试审查报告

**审查时间**: 2026-04-10
**审查人**: worker-2
**项目**: GIO 设计事务所后台管理系统

---

## 一、测试覆盖情况

### 1.1 单元测试
**状态**: 无测试目录
**问题**: `gio-api/src/test/` 目录不存在，项目完全没有单元测试覆盖。

### 1.2 集成测试
**状态**: 无

### 1.3 测试建议
- 添加 JUnit 5 + Mockito 单元测试
- 重点覆盖 Service 层业务逻辑
- 添加 Controller 层 @WebMvcTest 切片测试
- 添加 API 端到端测试

---

## 二、后台管理功能完整性分析

### 2.1 项目管理 (AdminProjectController)
**接口路径**: `/api/admin/projects`

| 功能 | 接口 | 状态 |
|------|------|------|
| 项目列表(分页) | GET / | 正常 |
| 项目详情 | GET /{id} | 正常 |
| 创建项目 | POST / | 正常 |
| 更新项目 | PUT /{id} | 正常 |
| 删除项目 | DELETE /{id} | 正常 |
| 分类下项目 | GET /category/{categoryId} | 正常 |
| 更新状态 | PUT /{id}/status | 正常 |
| 设置精品 | PUT /{id}/featured | 正常 |
| 批量更新状态 | PUT /batch/status | 正常 |
| 批量设置精品 | PUT /batch/featured | 正常 |
| 批量删除 | DELETE /batch | 正常 |

### 2.2 图片管理 (AdminImageController)
**接口路径**: `/api/admin`

| 功能 | 接口 | 状态 |
|------|------|------|
| 上传图片 | POST /projects/{projectId}/images | 正常 |
| 获取图片列表 | GET /projects/{projectId}/images | 正常 |
| 删除图片 | DELETE /images/{imageId} | 正常 |
| 设置封面 | PUT /images/{imageId}/cover | 正常 |
| 批量排序 | PUT /projects/{projectId}/images/sort | 正常 |
| 获取图片文件 | GET /images/{imageId}/file | 正常 |

### 2.3 分类管理 (AdminCategoryController)
**接口路径**: `/api/admin/categories`

| 功能 | 接口 | 状态 |
|------|------|------|
| 分类列表 | GET / | 正常 |
| 分类详情 | GET /{id} | 正常 |
| 创建分类 | POST / | 正常 |
| 更新分类 | PUT /{id} | 正常 |
| 删除分类 | DELETE /{id} | 正常 |

### 2.4 留言管理 (AdminMessageController)
**接口路径**: `/api/admin/messages`

| 功能 | 接口 | 状态 |
|------|------|------|
| 留言列表(分页) | GET / | 正常 |
| 留言详情 | GET /{id} | 正常 |
| 更新状态 | PUT /{id}/status | 正常 |
| 删除留言 | DELETE /{id} | 正常 |
| 清空留言 | DELETE / | 正常 |

### 2.5 AI 文案管理 (AiCopywritingController)
**接口路径**: `/api/admin`

| 功能 | 接口 | 状态 |
|------|------|------|
| 生成文案(流式) | POST /projects/{projectId}/ai-copywriting/stream | 正常 |
| 生成文案(同步) | POST /projects/{projectId}/ai-copywriting | 正常 |
| 自由创作(流式) | POST /copywriting/free/stream | 正常 |
| 推文列表 | GET /copywritings | 正常 |
| 推文详情 | GET /copywritings/{id} | 正常 |
| 创建推文 | POST /copywritings | 正常 |
| 更新推文 | PUT /copywritings/{id} | 正常 |
| 删除推文 | DELETE /copywritings/{id} | 正常 |
| 重新生成(流式) | POST /copywritings/{id}/regenerate/stream | 正常 |
| 项目推文列表 | GET /projects/{projectId}/copywritings | 正常 |

---

## 三、API 接口功能正确性评估

### 3.1 正常流程
- **项目 CRUD**: 完整实现，事务处理正确（@Transactional）
- **图片管理**: 包含压缩、缩略图生成、缓存机制（Caffeine）
- **分类管理**: 基础 CRUD 完整
- **留言管理**: 支持分页、状态管理
- **AI 文案**: 流式 SSE 输出，错误处理完善

### 3.2 数据验证
- **@Valid 注解**: 在 Project、Category、BatchOperationDTO 等处正确使用
- **@NotNull/@NotBlank**: 实体类有验证注解
- **@Size 限制**: 字符串长度有限制
- **GlobalExceptionHandler**: 统一异常处理完善

---

## 四、功能缺陷和边界情况

### 4.1 高风险缺陷

#### 【缺陷 1】分类删除无关联检查
**位置**: `AdminCategoryController.deleteCategory()`
**描述**: 删除分类时未检查是否有关联项目，直接删除会导致项目表外键引用失效。
**建议**: 添加关联项目检查，返回错误提示。

#### 【缺陷 2】留言实体无验证
**位置**: `Message.java`
**描述**: Message 实体缺少 @NotBlank 等验证注解，name、phone、content 可为空。
**建议**: 添加必要的验证注解：
```java
@NotBlank(message = "姓名不能为空")
private String name;
@NotBlank(message = "手机号不能为空")
private String phone;
@NotBlank(message = "留言内容不能为空")
private String content;
```

#### 【缺陷 3】分类删除时未处理关联项目
**位置**: `CategoryService`
**描述**: 分类被删除后，project.category_id 成为孤立外键。
**建议**: 软删除或设置 category_id 为 null。

#### 【缺陷 4】批量删除无事务回滚
**位置**: `ProjectServiceImpl.batchDelete()`
**描述**: for 循环删除图片，但图片删除失败时项目已删除，无法回滚。
**建议**: 使用批量删除 attachment 替代循环删除。

### 4.2 中风险缺陷

#### 【缺陷 5】图片上传无格式校验
**位置**: `ImageServiceImpl.uploadImage()`
**描述**: 未校验文件类型，允许任意文件上传。
**建议**: 添加文件类型白名单校验：
```java
String[] allowedTypes = {"jpg", "jpeg", "png", "gif", "webp"};
```

#### 【缺陷 6】分页参数无上限
**位置**: `getProjectList()`, `getMessages()`
**描述**: page 和 size 参数无上限，可传入极大值导致内存问题。
**建议**: 添加上限检查：
```java
if (size > 100) size = 100;
if (page < 1) page = 1;
```

#### 【缺陷 7】AI 文案生成无超时保护
**位置**: `AiCopywritingService`
**描述**: AI API 调用无超时设置，可能导致线程阻塞。
**建议**: 添加超时配置和熔断机制。

#### 【缺陷 8】热门项目无并发控制
**位置**: `incrementViewCount()`
**描述**: 浏览计数使用 SQL 原子递增但无缓存，高并发时可能超卖。
**建议**: 添加 Redis 计数缓存。

### 4.3 低风险问题

#### 【问题 1】图片文件双重存储
**描述**: 图片同时存储在文件系统和 Base64 字段中，浪费存储空间。
**建议**: 仅保留一种存储方式（推荐 Attachment 表）。

#### 【问题 2】项目排序字段无唯一性约束
**描述**: sort_order 可能出现重复值，排序不稳定。
**建议**: 添加唯一索引或复合排序。

#### 【问题 3】删除操作无软删除
**描述**: 项目和图片使用物理删除和逻辑删除混合。
**建议**: 统一使用逻辑删除。

---

## 五、边界情况测试建议

| 测试场景 | 输入 | 预期结果 |
|---------|------|---------|
| 项目名超长 | name 长度 200 | 应返回 400 错误 |
| 空文件上传 | MultipartFile 为空 | 应返回友好错误 |
| 分类下有项目时删除 | 分类关联 5 个项目 | 应阻止删除 |
| 负数分页 | page=-1, size=-1 | 应使用默认值 |
| 极大分页 | size=99999 | 应限制上限 |
| 并发浏览计数 | 1000 并发请求 | 计数应准确 |
| 批量删除 0 条 | ids=[] | 应返回成功 |
| 重复设置封面 | 同一图片两次 | 应正常处理 |

---

## 六、安全测试建议

| 测试点 | 风险 |
|--------|------|
| SQL 注入 | keyword 参数需测试 |
| XSS | name、content 等字段 |
| 文件上传 | 恶意文件类型 |
| 越权访问 | 直接访问其他项目 |
| CSRF | 表单提交需 Token |
| 敏感信息 | 密码返回、脱敏 |

---

## 七、总结

### 测试覆盖率
- **单元测试**: 0% (无测试目录)
- **集成测试**: 0%
- **API 测试**: 未覆盖

### 功能完整性
- **基础功能**: 完整
- **业务逻辑**: 基本正确
- **异常处理**: 较完善
- **数据验证**: 部分缺失

### 优先修复
1. 分类删除增加关联项目检查
2. Message 实体添加验证注解
3. 文件上传添加类型校验
4. 分页参数添加上限
5. 批量删除改为事务处理
