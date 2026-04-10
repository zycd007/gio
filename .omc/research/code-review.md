# GIO 项目代码质量审查报告

审查日期: 2026-04-10
审查范围: admin.ts, AdminProjectController, AdminImageController, PortalController, ImageServiceImpl, ProjectServiceImpl

---

## 严重程度分级
- **[CRITICAL]** 严重安全漏洞或会导致数据损坏
- **[HIGH]** 功能性bug或安全风险
- **[MEDIUM]** 代码质量/规范问题
- **[LOW]** 建议改进项

---

## 一、前端代码 (admin.ts)

### [HIGH] batchDeleteProjects 使用了非标准的 DELETE 请求体
**位置:** `admin.ts:311`
```typescript
export const batchDeleteProjects = (ids: number[]): Promise<void> => {
  return request.delete('/admin/projects/batch', { data: ids });
};
```
**问题:** HTTP DELETE 规范不建议带请求体，很多HTTP库和代理会丢弃body。Java后端 `AdminProjectController:135` 实际接收的是 `@RequestBody List<Integer> ids`，依赖body传递参数。
**建议:** 改用 POST 方法，或将 ids 改为路径参数。

### [MEDIUM] getMessages 响应结构与其他接口不一致
**位置:** `admin.ts:247-258`
```typescript
export const getMessages = (page: number = 1, size: number = 10, status?: number) => {
  return request.get('/admin/messages', {
    params: { page, size, status }
  }).then((res) => {
    const data = res.data || res;
    return {
      list: data.records || [],  // 其他接口用 data.list
      total: data.total || 0,
      page: data.current || 1,   // 字段名不一致
      size: data.size || 10
    };
  });
};
```
**问题:** 其他接口（如 `getProjects`）返回 `{list: [], total, page, size}`，但这里做了字段映射且命名不一致。
**建议:** 统一响应格式，后端返回一致的字段名。

### [LOW] 上传接口缺少文件大小校验
**位置:** `admin.ts:187-195`
```typescript
export const uploadImages = (projectId: number, files: File[]): Promise<ProjectImage[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  ...
```
**建议:** 前端添加文件大小校验，避免上传过大文件。

---

## 二、AdminProjectController.java

### [HIGH] 缺少管理员权限校验
**位置:** 整个控制器
**问题:** 所有 `/api/admin/*` 接口没有 `@PreAuthorize("hasRole('ADMIN')")` 或类似权限校验，任何已认证用户都可以访问。
**建议:** 添加 Spring Security 权限注解。

### [MEDIUM] createProject 和 updateProject 未校验 categoryId 存在性
**位置:** `AdminProjectController:57-59, 66-69`
```java
@PostMapping
public Result<Project> createProject(@Valid @RequestBody Project project) {
    projectService.save(project);  // 如果 categoryId 不存在，不会报错
    return Result.success(project);
}
```
**问题:** 如果传入无效的 categoryId，保存后不会报错但数据不一致。
**建议:** 在 service 层校验 categoryId 是否存在。

### [MEDIUM] batchDelete 参数校验缺失
**位置:** `AdminProjectController:135`
```java
@DeleteMapping("/batch")
public Result<Void> batchDelete(@RequestBody List<Integer> ids) {
    projectService.batchDelete(ids);
    return Result.success();
}
```
**建议:** 添加 `@Valid @NotEmpty` 校验。

---

## 三、AdminImageController.java

### [CRITICAL] 路径遍历漏洞 (Path Traversal)
**位置:** `AdminImageController:94`
```java
headers.setContentDispositionFormData("attachment", image.getImageName());
```
**问题:** `image.getImageName()` 直接来自数据库，如果数据库被污染或用户上传时构造恶意文件名（如 `../../etc/passwd.jpg`），会导致响应头注入或路径遍历。
**建议:**
1. 对文件名进行sanitize，只保留安全字符
2. 使用 UUID 生成的文件名，不使用原始文件名

### [HIGH] getImageFile 大文件内存溢出风险
**位置:** `AdminImageController:79-96`
```java
public ResponseEntity<byte[]> getImageFile(@PathVariable Integer imageId) {
    byte[] imageData = imageService.getImageFile(imageId);
    ...
    headers.setContentLength(imageData.length);
    return ResponseEntity.ok().headers(headers).body(imageData);
}
```
**问题:** 直接将整个图片加载到内存返回，没有流式处理，大图片会导致 OOM。
**建议:** 使用 `StreamingResponseBody` 进行流式传输。

### [MEDIUM] 缺少文件类型严格校验
**位置:** `AdminImageController:99-106`
```java
private String getContentType(String imageType) {
    switch (imageType.toLowerCase()) {
        case "png": return "image/png";
        case "gif": return "image/gif";
        case "webp": return "image/webp";
        default: return "image/jpeg";  // 未知的都当 jpeg，存在安全隐患
    }
}
```
**问题:** 恶意用户可以上传任意扩展名的文件但被当作图片处理。
**建议:**
1. 上传时校验文件 magic bytes
2. 不允许未知类型返回默认图片，应该拒绝

### [MEDIUM] 缺少文件大小限制配置
**问题:** 没有配置 `spring.servlet.multipart.max-file-size`，上传大文件可能导致服务器问题。

---

## 四、PortalController.java

### [MEDIUM] 分页缺少上限校验
**位置:** `PortalController:40-47`
```java
@GetMapping("/projects")
public Result<PageResult<ProjectListItemDTO>> getProjects(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer size,
        ...
```
**问题:** 如果 `size=10000`，没有校验，可能查询过多数据。
**建议:** 添加最大分页大小限制，如 `size > 100 ? 100 : size`。

---

## 五、ImageServiceImpl.java

### [CRITICAL] 图片Base64存储导致数据库膨胀
**位置:** `ImageServiceImpl:114`
```java
attachment.setBase64Data(Base64.getEncoder().encodeToString(file.getBytes()));
```
**问题:**
1. 每个图片的 Base64 数据直接存储在数据库，占用大量空间
2. 一次查询获取图片列表会同时加载所有图片数据，极大影响性能
3. MySQL BLOB/TEXT 字段有大小限制

**建议:** 改为存储文件路径，文件系统在文件系统。

### [HIGH] 文件上传写入非原子操作
**位置:** `ImageServiceImpl:81-82`
```java
Path filePath = Paths.get(uploadPath, fileName);
Files.write(filePath, file.getBytes());
```
**问题:** 如果写入过程中断电或崩溃，文件会损坏。
**建议:** 先写临时文件，成功后再 rename。

### [MEDIUM] 临时文件生成在系统临时目录
**位置:** `ImageServiceImpl:377`
```java
Path tempFile = Files.createTempFile("thumb_", ".jpg");
```
**问题:**
1. 多实例环境下临时文件冲突
2. 临时文件清理依赖JVM，可能占用空间
**建议:** 使用内存操作或应用专用临时目录。

### [MEDIUM] 缓存无分布式同步
**位置:** `ImageServiceImpl:40-48`
```java
private final Cache<Integer, byte[]> thumbnailCache = Caffeine.newBuilder()
        .maximumSize(100)
        .expireAfterWrite(30, TimeUnit.MINUTES)
        .build();
```
**问题:** 多实例部署时，每个实例有独立缓存，数据不一致。
**建议:** 使用 Redis 分布式缓存。

### [MEDIUM] generateThumbnail 异常被静默处理
**位置:** `ImageServiceImpl:272-274`
```java
} catch (Exception e) {
    // 如果生成失败，返回原图
    return Base64.getDecoder().decode(attachment.getBase64Data());
}
```
**问题:** 缩略图生成失败时返回原图，用户可能感知不到问题。
**建议:** 记录日志，便于排查。

### [LOW] 图片扩展名处理可能返回空字符串
**位置:** `ImageServiceImpl:69-71`
```java
String extension = originalFilename != null && originalFilename.contains(".")
        ? originalFilename.substring(originalFilename.lastIndexOf("."))
        : ".jpg";
```
**问题:** 如果文件名无扩展名，substring 会返回空字符串，结果是 `.jpg` 的文件名没有扩展名问题但 `extension.replace(".", "")` 会返回空字符串传给 `setImageType`。

---

## 六、ProjectServiceImpl.java

### [MEDIUM] @Transactional 过度使用
**位置:** `ProjectServiceImpl:134, 217, 227, 237`
```java
@Transactional
public void incrementViewCount(Integer id) {
    this.lambdaUpdate()
        .eq(Project::getId, id)
        .setSql("view_count = view_count + 1")
        .update();
}
```
**问题:** 每次浏览量+1都开启事务，有性能损耗。
**建议:** 浏览量更新可以使用异步批量更新。

### [MEDIUM] batchDelete 循环删除图片效率低
**位置:** `ProjectServiceImpl:241-243`
```java
for (Integer id : ids) {
    imageService.deleteImagesByProject(id);
}
```
**问题:** N 次数据库查询，应该批量操作。
**建议:** 在 ImageService 中添加 `deleteImagesByProjectIds(List<Integer> projectIds)` 批量方法。

### [MEDIUM] convertToDTO 存在空指针风险
**位置:** `ProjectServiceImpl:262`
```java
dto.setIsFeatured(project.getIsFeatured());
```
**问题:** 如果 MyBatis 返回的 Project 是代理对象，`getIsFeatured()` 可能返回 null 而不是数据库默认值。
**建议:** 使用 `project.getIsFeatured() != null ? project.getIsFeatured() : 0` 或在实体中设置默认值。

### [LOW] 重复的分类查询逻辑
**位置:** `ProjectServiceImpl:265-272`
```java
if (categoryMap != null && categoryMap.containsKey(project.getCategoryId())) {
    dto.setCategoryName(categoryMap.get(project.getCategoryId()).getName());
} else {
    // 备用：直接查询
    Category category = categoryService.getById(project.getCategoryId());
    ...
}
```
**问题:** 有备用查询说明 map 可能不完整，但这个分支永远不会被触发因为外面已经保证 categoryMap 有所有用到的分类。
**建议:** 删除 else 分支或移除注释。

---

## 七、安全问题汇总

| 严重程度 | 问题 | 位置 |
|---------|------|------|
| CRITICAL | 路径遍历漏洞 | AdminImageController:94 |
| CRITICAL | Base64 图片存储数据库 | ImageServiceImpl:114 |
| HIGH | 缺少管理员权限校验 | AdminProjectController |
| HIGH | 大文件内存溢出 | AdminImageController:85 |
| HIGH | batchDelete 用 DELETE body | admin.ts:311 |

---

## 八、优先修复建议

1. **[最高]** 修复 AdminImageController 的路径遍历漏洞 - sanitize 文件名
2. **[最高]** 修改图片存储方式为文件系统而非 Base64
3. **[高]** 添加管理员权限校验
4. **[高]** 修复 batchDelete HTTP 方法问题
5. **[中]** 添加分页大小限制
6. **[中]** 实现文件类型 magic bytes 校验
