# GIO 项目技术架构审查报告

## 审查范围

- `gio-api/src/main/java/com/gio` 目录下的全部 Java 代码
- 包结构：controller, service, mapper, entity, dto, config, common
- 共计约 50 个 Java 文件

---

## 一、整体架构评估

### 1.1 分层结构

| 层级 | 目录 | 文件数 | 评价 |
|------|------|--------|------|
| Controller | controller/ | 9 | 合理 |
| Service 接口 | service/ | 6 | 合理 |
| Service 实现 | service/impl/ | 6 | 合理 |
| Mapper | mapper/ | 7 | 合理 |
| Entity | entity/ | 6 | 合理 |
| DTO | dto/ | 9 | 合理 |
| Config | config/ | 4 | 合理 |
| Common | common/ | 2 | 合理 |

**结论：分层清晰，符合 Spring Boot 标准项目结构。**

### 1.2 包结构问题

- **dto 包过于分散**：部分 DTO 如 `BatchOperationDTO`、`ImageSortDTO` 是通用操作对象，应归入 `common/dto` 或单独 `dto/common` 包，而非散落在根 dto 包下。
- **config 和 common 并列**，但 `common/exception` 作为子包存在，**exception 包应提升为顶层包** `exception/`，与 `common/` 平级，与 Spring Boot 社区实践一致。
- **缺少统一的 API 版本管理**：所有接口无版本前缀（如 `/api/v1/`），未来升级存在兼容风险。

---

## 二、代码质量问题

### 2.1 Controller 层

#### 问题 1：返回类型不一致

- `AdminProjectController.createProject()` 返回 `Result<Project>` —— 直接返回 Entity
- `PortalController.getCategories()` 返回 `Result<List<Category>>` —— 直接返回 Entity
- `AdminProjectController.getProject()` 返回 `Result<ProjectDetailDTO>` —— 返回 DTO

**建议**：统一使用 DTO/VO 返回，Entity 不应直接暴露给 API 客户端。

#### 问题 2：@Valid 注解不完整

- `createProject()` 有 `@Valid @RequestBody Project project`
- `updateProject()` 有 `@Valid @RequestBody Project project`
- 但 `deleteProject()`、`getProject()` 等**只校验路径参数 ID，未校验 ID 的合法性**（如负数）

**建议**：对所有请求参数添加校验，使用 `@Validated` 在 Controller 类级别开启参数校验。

#### 问题 3：异常处理不一致

- `AdminProjectController` 中多处手动判断返回 404：`if (dto == null) return Result.error(404, "项目不存在")`
- 这种处理分散在 Controller 中，应统一到 Service 层抛出 `BusinessException.notFound()`

#### 问题 4：ImageController 存在冗余方法

```java
@GetMapping("/images/{imageId}")          // C端兼容旧路径
public ResponseEntity<byte[]> getImageFileCompat(...)

@GetMapping("/images/{imageId}/file")     // C端标准路径
public ResponseEntity<byte[]> getImageFile(...)
```

两个方法功能完全相同，仅路径不同，增加了维护成本。

---

### 2.2 Service 层

#### 问题 5：Service 接口中混入视图对象

`ProjectService.java:5` 导入了 `com.gio.common.Result`：

```java
public interface ProjectService extends IService<Project> {
    Result<Void> setProjectFeatured(Integer id, Integer isFeatured);
}
```

**Service 接口不应依赖 `Result` 类**——这是 Controller 的职责。Service 应返回业务数据或抛异常，让 Controller 决定如何包装。

#### 问题 6：手动字段映射过多

`ProjectServiceImpl.getProjectDetail()` 中大量手写字段映射：

```java
dto.setId(project.getId());
dto.setCategoryId(project.getCategoryId());
dto.setName(project.getName());
dto.setLocation(project.getLocation());
// ... 重复 setter 约 10 行
```

**建议**：使用 MapStruct 或 BeanUtils.copyProperties() 减少重复代码。

#### 问题 7：图片存储严重问题

`ImageServiceImpl` 将图片数据以 **Base64 编码存入 MySQL**：

```java
attachment.setBase64Data(Base64.getEncoder().encodeToString(file.getBytes()));
```

- MySQL 单行数据有 65535 字节限制，大图片会溢出
- 数据库体积急剧膨胀，影响查询性能
- 每次请求图片都要编解码，CPU 开销大
- **正确做法**：文件存磁盘/S3，数据库只存路径/URL

#### 问题 8：临时文件未清理

`ImageServiceImpl.generateThumbnail()` 创建临时文件后，在 finally 中删除了自身，但文件上传路径 `uploadPath` 中写入的文件**从不删除**，会持续积累。

#### 问题 9：事务边界不清晰

`ProjectServiceImpl.batchDelete()` 使用 for 循环逐个删除图片：

```java
for (Integer id : ids) {
    imageService.deleteImagesByProject(id);  // N 次 DB 操作
}
this.removeByIds(ids);
```

应在 Service 层加 `@Transactional`，或在 Mapper 层用批量 SQL。

---

### 2.3 Entity 层

#### 问题 10：Integer 类型滥用

所有布尔标志位使用 `Integer`（如 `status`、`isFeatured`、`hasCopywriting`）而非 `Boolean`：

```java
private Integer status;        // 0-下架 1-发布
private Integer isFeatured;    // 0-普通 1-精选
```

**建议**：MyBatis Plus 支持 `tinyint(1)` 映射 Java `Boolean`，代码更简洁，语义更清晰。

#### 问题 11：实体类缺少 @TableLogic

项目中未发现 `@TableLogic` 注解，但 `ImageServiceImpl` 中使用**手动逻辑删除**：

```java
image.setStatus(0);
projectImageMapper.updateById(image);
```

**建议**：在 ProjectImage 实体上添加 `@TableLogic` 注解，让 MyBatis Plus 自动处理逻辑删除，无需手动 update。

#### 问题 12：实体校验注解与数据库约束不对应

`Project.name` 使用 `@NotBlank` 但数据库可能未设 NOT NULL 约束（取决于实际 DDL），需确保两边一致。

---

### 2.4 DTO 层

#### 问题 13：DTO 嵌套过深

`ProjectDetailDTO.ImageInfo` 作为内部类存在：

```java
public class ProjectDetailDTO {
    private List<ImageInfo> images;
    // 内部类
    public static class ImageInfo { ... }
}
```

**建议**：抽为独立文件 `ImageInfo.java`，避免内部类增加编译复杂度，也便于复用。

#### 问题 14：缺少分页 DTO 的总数返回

`PageResult` DTO 存在，但部分 Controller 返回 `List<Project>` 而非 `PageResult`，分页信息丢失。

---

### 2.5 Config 层

#### 问题 15：Security 配置放行过多

`SecurityConfig.java:38`：

```java
.requestMatchers("/api/admin/images/**").permitAll()
```

管理端图片接口**无需登录即可访问**，任何人都可以枚举图片 ID 访问后台图片数据，存在**信息泄露风险**。应要求认证或至少限制访问频率。

#### 问题 16：CORS 配置硬编码域名

```java
configuration.setAllowedOrigins(List.of("http://localhost:5173", ...));
```

开发/生产域名混在一起，应使用配置文件管理不同环境的白名单。

#### 问题 17：缺少请求大小限制配置

文件上传无全局 `spring.servlet.multipart.max-file-size` 和 `max-request-size` 限制，虽然 `GlobalExceptionHandler` 捕获了 `MaxUploadSizeExceededException`，但预防性配置缺失。

---

### 2.6 Common 层

#### 问题 18：Result 错误码体系不完整

- 依赖魔法数字（200, 404, 500）而非枚举
- `GlobalExceptionHandler` 同时捕获 `Exception` 和 `RuntimeException`，后者是前者的父类，**顺序错误**，`RuntimeException` 分支永远不会被执行

```java
@ExceptionHandler(Exception.class)       // 先匹配
public Result<Void> handleException(Exception e) { ... }

@ExceptionHandler(RuntimeException.class) // 永远不会执行
public Result<Void> handleRuntimeException(RuntimeException e) { ... }
```

**正确顺序**：先处理子类 `RuntimeException`，再处理父类 `Exception`。

#### 问题 19：BusinessException 静态工厂方法未使用

`BusinessException.notFound()` 等方法已定义，但实际代码中 Service 层大量手动 `new BusinessException(404, ...)`，应统一使用工厂方法。

---

### 2.7 API 设计问题

#### 问题 20：RESTful 规范不一致

- 批量操作：`DELETE /batch` 用 List<Integer> 作为 body，RESTful 推荐用 query string 或路径参数
- `PUT /{id}/status` 和 `PUT /{id}/featured` 都是布尔操作，应统一设计

#### 问题 21：分页参数风格不统一

- 部分接口：`GET /projects?page=1&size=10`
- 应统一为**基于 0 或 1 的页码起点**，当前混用（Portal 用 1，Admin 也用 1）

#### 问题 22：缺少 API 文档

无 SpringDoc/OpenAPI 注解，Swagger 文档缺失，不利于前后端协作和 API 测试。

---

## 三、安全问题

### 高风险

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| S1 | 管理图片接口无需认证 | SecurityConfig:38 | 枚举攻击获取后台图片数据 |
| S2 | Base64 图片存数据库 | ImageServiceImpl:114 | 数据库膨胀，65535 字节限制风险 |
| S3 | JWT secret 未外部化 | JwtAuthenticationFilter | 硬编码在代码中 |

### 中风险

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| S4 | 异常信息外泄 | GlobalExceptionHandler:38 | 生产环境仍打印完整堆栈 |
| S5 | 硬编码文件上传路径 | application.yml | 不同环境路径不同 |
| S6 | 缺少请求限流 | 全局 | 文件上传和接口均无限流 |

---

## 四、数据库交互

### 正面

- 使用 MyBatis Plus 的 ServiceImpl 基类，减少了大量样板代码
- 批量查询优化（`getFeaturedProjects` 先查分类再批量转换为 Map，避免 N+1）
- 分页插件配置正确

### 问题

- `batchDelete` 未使用批量 SQL，效率低
- `updateImageSortOrder` 逐条更新 N 次，应合并为一条 UPDATE 语句

---

## 五、优化建议汇总

### 高优先级

1. **移除 Base64 图片存储**：改用本地文件系统或 OSS，数据库仅存路径
2. **修复 SecurityConfig**：管理端图片接口加认证，或移到需要认证的路径下
3. **修复 GlobalExceptionHandler 异常处理顺序**：RuntimeException 放在 Exception 之前
4. **添加 @TableLogic**：ProjectImage 实体加逻辑删除注解，简化删除逻辑

### 中优先级

5. **统一返回类型**：Controller 全部返回 DTO，移除直接暴露 Entity
6. **提取 ImageInfo 为独立类**：从 ProjectDetailDTO 内部类中拆分出来
7. **统一分页起点**：建议统一基于 1（当前已统一，但需确认）
8. **Result 错误码枚举化**：定义 `ResultCode` 枚举替代魔法数字
9. **添加 @Validated**：在 Controller 类级别加 `@Validated`，启用参数自动校验

### 低优先级

10. 引入 MapStruct 做实体-DTO 映射
11. 补充 SpringDoc/OpenAPI 注解
12. CORS 配置外部化到 application.yml
13. API 版本前缀（`/api/v1/`）
14. 请求限流（Spring Boot Resilience4j）

---

## 六、补充发现问题

### 6.1 代码重复问题

**ProjectServiceImpl 中 DTO 转换方法重复：**

```java
// 248-251行
private ProjectListItemDTO convertToDTO(Project project) {
    return convertToDTO(project, null);
}

// 253-281行
private ProjectListItemDTO convertToDTO(Project project, java.util.Map<Integer, Category> categoryMap) {
    // 两处逻辑有重复
}
```

**ImageServiceImpl 中缓存初始化重复：**

```java
// 40-48行：两处 Cache 创建逻辑相似
private final Cache<Integer, byte[]> thumbnailCache = Caffeine.newBuilder()
        .maximumSize(100)
        .expireAfterWrite(30, TimeUnit.MINUTES)
        .build();
private final Cache<Integer, byte[]> imageCache = Caffeine.newBuilder()
        .maximumSize(50)
        .expireAfterWrite(10, TimeUnit.MINUTES)
        .build();
```

### 6.2 Spring Framework 使用问题

**Field 注入方式混用：**

```java
// 大量使用 @Autowired field 注入
@Autowired
private ProjectService projectService;
```

`AdminServiceImpl` 已正确使用构造器注入，但其他 Service 仍用 field 注入。

**AiCopywritingController 直接创建线程池：**

```java
// 27行
private final ExecutorService executor = Executors.newCachedThreadPool();
```

- 未通过 Spring 管理生命周期
- 未指定线程池拒绝策略
- 缺少统一线程池管理

### 6.3 业务逻辑问题

**Service 层直接返回 Result（分层混乱）：**

`ProjectServiceImpl.setProjectFeatured` 返回 `Result<Void>`，破坏了分层架构。Service 应返回业务状态或抛异常，由 Controller 决定如何包装。

**批量操作效率问题：**

`updateImageSortOrder` 逐条更新 N 次数据库，应使用批量更新。

### 6.4 统一 API 版本建议

建议添加 `/api/v1/` 前缀，便于未来 API 升级和版本管理。

---

## 七、总体评分

| 维度 | 评分（/10） | 说明 |
|------|------------|------|
| 包结构 | 7 | 清晰，dto 和 exception 包需优化 |
| 代码规范 | 6 | 存在类型滥用、重复映射、魔法数字 |
| 异常处理 | 5 | 异常捕获顺序错误，体系不完整 |
| API 设计 | 6 | 基本 RESTful，但一致性不足 |
| 安全 | 4 | 管理图片放行、Base64 存储为高风险 |
| 数据库交互 | 7 | MyBatis Plus 用法正确，批量操作待优化 |
| Spring 使用 | 6 | 混用注入方式，线程池未统一管理 |
| **综合** | **6** | 小型项目可接受，需重点修复安全问题 |

---

## 八、优化建议优先级

### 高优先级（立即修复）

1. **移除 Base64 图片存储**：改用本地文件系统或 OSS，数据库仅存路径
2. **修复 SecurityConfig**：管理端图片接口加认证
3. **修复 GlobalExceptionHandler 异常处理顺序**：RuntimeException 必须在 Exception 之前
4. **添加 @TableLogic**：简化删除逻辑

### 中优先级（近期修复）

5. **统一返回类型**：Controller 全部返回 DTO，移除直接暴露 Entity
6. **提取 ImageInfo 为独立类**
7. **Service 层不应返回 Result**：改为抛异常或返回 boolean
8. **Result 错误码枚举化**：定义 `ResultCode` 枚举
9. **批量操作优化**：合并为更少的 SQL 语句
10. **线程池统一管理**

### 低优先级（规划中）

11. 引入 MapStruct 做实体-DTO 映射
12. 统一注入方式（构造器注入）
13. CORS 配置外部化
14. API 版本前缀（`/api/v1/`）
15. 添加 SpringDoc/OpenAPI 文档
