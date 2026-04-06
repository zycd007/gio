# GIO 项目开发规范

## 项目概述
- **项目名称**: GIO 设计事务所
- **技术栈**: Spring Boot 3.2.0 + MyBatis Plus 3.5.5 + MySQL
- **Java 版本**: 17
- **架构**: 单体架构（后端合并为 gio-api）

### 服务列表
| 服务名 | 端口 | 说明 | 访问范围 |
|--------|------|------|----------|
| gio-api | 8081 | 后端 API 服务 | 公开 |

### 访问地址
- **C 端官网**: http://localhost:8081
- **后台管理**: http://localhost:8081/admin/

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

# 启动后端服务
cd gio-api
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
curl -X POST http://localhost:8081/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 部署

### 部署方式：本地打包 + 上传服务器（推荐）

> **服务器信息：腾讯云**
> - IP: 140.143.87.54
> - 用户名: ubuntu
> - 密码: @yuku007@

#### 第一步：本地构建

```bash
# 1. 设置 Java 环境
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"

# 2. 构建后端
cd E:/my_projects/gio
mvn clean package -DskipTests

# 3. 构建前端
cd gio-web
pnpm install
pnpm build
```

#### 第二步：上传到服务器

```bash
# 上传后端 jar 包
scp gio-api/target/gio-api-1.0.0.jar ubuntu@140.143.87.54:/tmp/

# 上传前端构建文件
scp -r gio-web/dist ubuntu@140.143.87.54:/tmp/
```

#### 第三步：服务器部署

```bash
# 使用 Python + paramiko 远程部署（推荐）
python -c "
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('140.143.87.54', username='ubuntu', password='@yuku007@')

# 1. 创建目录并移动文件
stdin, stdout, stderr = client.exec_command(
    'mkdir -p ~/gio/logs ~/gio/uploads ~/gio/static && ' +
    'rm -rf ~/gio/static/* && ' +
    'mv /tmp/gio-api-1.0.0.jar ~/gio/ && ' +
    'mv /tmp/dist/* ~/gio/static/')

# 2. 停止旧服务
stdin, stdout, stderr = client.exec_command(
    'pkill -f \"gio-.*\.jar\" 2>/dev/null || true')

# 3. 启动后端服务
stdin, stdout, stderr = client.exec_command(
    'cd ~/gio && nohup java -jar gio-api-1.0.0.jar --server.port=8081 > ~/gio/logs/api.log 2>&1 &')

# 4. 配置 Nginx 反向代理
nginx_config = '''server {
    listen 80;
    server_name _;
    location / {
        root /home/ubuntu/gio/static;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8081/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}'''
stdin.channel.send(nginx_config.encode())
stdin.channel.send(b'\n')
stdin.channel.shutdown_write()
stdin, stdout, stderr = client.exec_command('sudo tee /etc/nginx/sites-available/gio')
stdin, stdout, stderr = client.exec_command('sudo nginx -t && sudo nginx -s reload')

client.close()
print('部署完成')
"
```

**访问地址：**
- 前端页面：http://140.143.87.54
- 后端 API：http://140.143.87.54:8081

**日志查看：**
```bash
ssh ubuntu@140.143.87.54
tail -f ~/gio/logs/api.log
```

### 本地部署（开发测试）
1. 确保 MySQL 服务运行
2. 运行 `mvn clean install -DskipTests` 构建所有模块
3. 启动 gio-api 服务
4. 上传目录确保有写权限

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
- 检查端口是否被占用（8081）
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
- 使用 `git status` 检查是否有残留文件

## 安全注意事项
- 生产环境需修改 `jwt.secret`
- 数据库密码建议使用环境变量
- 开启 HTTPS
- 定期备份数据库
