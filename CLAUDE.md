# GIO 项目开发规范

## 项目概述
- **项目名称**: GIO 设计事务所后端 API
- **技术栈**: Spring Boot 3.2.0 + MyBatis Plus 3.5.5 + MySQL
- **Java 版本**: 17
- **端口**: 8080

## 开发环境配置

### 必需环境
```
- JDK 17 (推荐使用 ms-17.0.17 或 openjdk-17+)
- Maven 3.6+
- MySQL 8.0+
```

### 启动命令
```bash
cd gio-api
JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17" mvn spring-boot:run
```

### 配置说明
- **配置文件**: `gio-api/src/main/resources/application.yml`
- **数据库**: 阿里云 MySQL (8.137.63.159:3306/gio_design)
- **上传路径**: `./uploads/`

## 项目结构
```
gio/
├── gio-api/                 # 后端 API 模块
│   ├── src/main/java/com/gio/
│   │   ├── controller/     # 控制器层
│   │   ├── service/        # 服务层
│   │   ├── mapper/         # 数据访问层
│   │   ├── entity/         # 实体类
│   │   ├── dto/            # 数据传输对象
│   │   ├── common/         # 通用类 (Result, 异常等)
│   │   └── config/         # 配置类
│   ├── src/main/resources/
│   │   ├── application.yml # 配置文件
│   │   └── mapper/         # MyBatis XML
│   └── pom.xml
├── gio-web/                # 前端小程序
├── init_db.py              # 数据库初始化脚本
└── migrate_images.py       # 图片迁移脚本
```

## 开发规范

### 代码风格
- 使用 Lombok `@Data` 注解简化实体类
- 统一返回格式：`Result<T>`
- 使用 MyBatis Plus 的 `BaseMapper` 和 `IService`
- 异常处理：使用 `GlobalExceptionHandler` 统一处理

### 数据库规范
- 表名：小写 + 下划线（如 `project_image`）
- 主键：自增 INT，使用 `@TableId(type = IdType.AUTO)`
- 逻辑删除：`deleted` 字段，0-未删除，1-已删除
- 时间字段：`created_at`, `updated_at` 自动填充

### API 规范
- RESTful 风格
- 管理端接口：`/api/admin/*`
- 公共接口：`/api/*`
- JWT Token 认证，过期时间 24 小时

## 测试

### 单元测试
```bash
mvn test
```

### API 测试
```bash
# 获取分类列表
curl http://localhost:8080/api/categories

# 获取项目列表
curl http://localhost:8080/api/projects
```

## 部署

### 本地部署
1. 确保 MySQL 服务运行
2. 运行 `init_db.py` 初始化数据库（如需要）
3. 启动后端：`mvn spring-boot:run`
4. 上传目录确保有写权限

### 服务器部署
1. 数据库已在阿里云 (8.137.63.159)
2. 上传 jar 包到服务器
3. 使用 `nohup java -jar gio-api.jar &` 后台运行
4. 配置 Nginx 反向代理（可选）

### 数据库迁移
```bash
# 导出数据
mysqldump -h localhost -u root -p gio_design > backup.sql

# 导入到阿里云
mysql -h 8.137.63.159 -u root -p gio_design < backup.sql
```

## 常见问题

### Lombok 编译错误
确保使用 Java 17 编译，并配置了 maven-compiler-plugin：
```xml
<annotationProcessorPaths>
    <path>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
    </path>
</annotationProcessorPaths>
```

### Spring Boot 启动失败
- 检查端口 8080 是否被占用
- 检查数据库连接配置
- 确保 MyBatis Plus 版本与 Spring Boot 兼容

### 文件上传失败
- 检查 `uploads/` 目录是否存在
- 确保有写权限
- 检查 `application.yml` 中的文件大小限制

## Git 提交规范
- 新功能：`feat: add xxx feature`
- Bug 修复：`fix: resolve xxx issue`
- 配置修改：`chore: update xxx config`
- 重构：`refactor: improve xxx structure`

## 安全注意事项
- 生产环境需修改 `jwt.secret`
- 数据库密码建议使用环境变量
- 开启 HTTPS
- 定期备份数据库
