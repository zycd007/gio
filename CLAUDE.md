# GIO 项目开发规范

## 项目概述
- **项目名称**: GIO 设计事务所
- **技术栈**: Spring Boot 3.2.0 + MyBatis Plus 3.5.5 + MySQL
- **Java 版本**: 17
- **架构**: 微服务架构

## 微服务架构

### 服务列表
| 服务名 | 端口 | 说明 | 访问范围 |
|--------|------|------|----------|
| gio-portal | 8081 | C 端官网服务 | 公开 |
| gio-admin | 8082 | 后台管理服务 | 需登录 |
| gio-service | - | 共享服务层 | 内部依赖 |

### 访问地址
- **C 端官网**: http://localhost:8081
- **后台管理**: http://localhost:8082

### 项目结构
```
gio/
├── pom.xml                  # 父 POM
├── gio-service/             # 共享服务模块
│   ├── src/main/java/com/gio/
│   │   ├── entity/         # 实体类
│   │   ├── dto/            # DTO
│   │   ├── mapper/         # MyBatis Mapper
│   │   ├── service/        # 服务层
│   │   ├── common/         # 通用类
│   │   └── config/         # 配置类
│   └── pom.xml
├── gio-portal/              # C 端官网服务
│   ├── src/main/java/com/gio/
│   │   ├── controller/     # 控制器
│   │   └── PortalApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── gio-admin/               # 后台管理服务
│   ├── src/main/java/com/gio/
│   │   ├── controller/     # 控制器
│   │   └── AdminApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── gio-web/                # 小程序前端
├── init_db.py              # 数据库初始化脚本
└── migrate_images.py       # 图片迁移脚本
```

## 开发环境配置

### 必需环境
```
- JDK 17 (必须使用 ms-17.0.17，路径: C:/Users/Administrator/.jdks/ms-17.0.17)
- Maven 3.6+
- MySQL 8.0+
```

### 环境变量配置
```bash
# 必须设置 JAVA_HOME 为 JDK 17（重要：不要使用其他版本）
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"
```

### 启动命令
```bash
# 构建所有模块
cd gio
mvn clean install -DskipTests

# 启动 C 端服务
cd gio-portal
mvn spring-boot:run

# 启动后台管理服务
cd gio-admin
mvn spring-boot:run
```

### 配置说明
- **数据库**: 阿里云 MySQL (8.137.63.159:3306/gio_design)
- **上传路径**: `./uploads/`

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
- C 端接口：`GET /api/categories`, `GET /api/projects`
- 管理端接口：`/api/admin/*` (需要 JWT 认证)
- JWT Token 认证，过期时间 24 小时

## 测试

### 单元测试
```bash
mvn test
```

### API 测试
```bash
# C 端 - 获取分类列表
curl http://localhost:8081/api/categories

# C 端 - 获取项目列表
curl http://localhost:8081/api/projects

# 管理端 - 登录
curl -X POST http://localhost:8082/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 部署

### 本地部署
1. 确保 MySQL 服务运行
2. 运行 `mvn clean install -DskipTests` 构建所有模块
3. 分别启动两个服务
4. 上传目录确保有写权限

### 服务器部署
1. 数据库已在阿里云 (8.137.63.159)
2. 上传 jar 包到服务器
3. 使用 `nohup java -jar gio-portal.jar &` 后台运行
4. 使用 `nohup java -jar gio-admin.jar &` 后台运行
5. 配置 Nginx 反向代理（可选）

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
- 检查端口是否被占用（8081/8082）
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

## 代码清理规范
- 每次重构后，删除旧的不再使用的代码文件
- 清理无用的 import 和依赖
- 确保删除旧的模块文件夹（如 gio-api）
- 使用 `git status` 检查是否有残留文件

## 安全注意事项
- 生产环境需修改 `jwt.secret`
- 数据库密码建议使用环境变量
- 开启 HTTPS
- 定期备份数据库
