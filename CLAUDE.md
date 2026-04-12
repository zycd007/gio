# GIO 项目开发规范

## 项目概述
- **项目名称**: 光里光外-专注空间智能照明设计
- **技术栈**: Spring Boot 3.2.0 + MyBatis Plus 3.5.5 + MySQL
- **Java 版本**: 17

### 服务列表
| 服务名 | 端口 | 说明 | 访问范围 |
|--------|------|------|----------|
| gio-web | 5173 | 前端开发服务器 | 本地开发 |
| gio-api | 8081 | 后端 API 服务 | 公开 |

### 访问地址
- **C 端官网**: http://localhost:5173
- **后台管理**: http://localhost:5173/admin/

### 项目结构
```
gio/
├── pom.xml                  # 父 POM
├── gio-api/                 # 后端 API 服务（单体）
│   ├── src/main/java/com/gio/
│   │   ├── entity/         # 实体类
│   │   ├── dto/            # DTO
│   │   ├── mapper/         # MyBatis Mapper
│   │   ├── service/        # 服务层
│   │   ├── controller/     # 控制器
│   │   ├── common/         # 通用类
│   │   └── config/         # 配置类
│   └── pom.xml
├── gio-web/                # 前端
├── init_db.py              # 数据库初始化脚本
└── migrate_images.py       # 图片迁移脚本
```

## 开发环境配置

### 必需环境
```
- JDK 17 (必须使用 ms-17.0.17，路径：C:/Users/Administrator/.jdks/ms-17.0.17)
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

# 启动后端服务
cd gio-api
mvn spring-boot:run
```

### 配置说明
- **数据库**: 腾讯云 MySQL (140.143.87.54:3306/gio_design)

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
curl -X POST http://localhost:8081/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 服务器信息
> **服务器信息：腾讯云**
> - IP: 140.143.87.54
> - 服务器用户名：ubuntu
> - 服务器密码：@yuku007@
> - 数据库用户名：root
> - 数据库密码：@Yuku007@

**访问地址：**
- 前端页面：http://140.143.87.54
- 后端 API：http://140.143.87.54:8081

**日志查看：**
```bash
ssh ubuntu@140.143.87.54
tail -f ~/gio/logs/api.log
```
