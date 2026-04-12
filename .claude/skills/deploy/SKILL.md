---
name: deploy
description: GIO 项目全栈部署技能。当用户说"部署"、"上线"、"deploy"、"发布"时触发此技能。自动完成：本地构建（后端 mvn + 前端 pnpm）→ 上传到腾讯云服务器 → 重启 Nginx → 健康验证（HTTP/HTTPS/域名）。
---

# GIO 项目部署技能

## 概述
此技能用于将 GIO 项目（前端 gio-web + 后端 gio-api）部署到腾讯云生产服务器。

## 服务器信息
- **IP**: 140.143.87.54
- **用户**: ubuntu
- **密码**: @yuku007@
- **数据库**: MySQL 8.0 (同服务器)
- **域名**: gio-ai.cn

## 重要规则

### 文件上传方式
**禁止使用 bash + scp 上传文件**，必须使用 Python + paramiko：
```python
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('140.143.87.54', username='ubuntu', password='@yuku007@')
sftp = client.open_sftp()
sftp.put(local_path, remote_path)
```

### Java 环境设置（Windows Bash）
Windows Git Bash 环境下，使用 Unix 路径格式设置 Java：
```bash
export JAVA_HOME="/c/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"
```

### Nginx 配置
服务器使用 Nginx 处理所有请求：
- HTTP (80) → 重定向到 HTTPS (301)
- HTTPS (443) → 静态文件 + API 反向代理
- API 反向代理到 localhost:8081

部署后必须确保 Nginx 运行，不能使用 Python http.server。

## 部署流程

### 1. 本地构建（并行执行）

后端和前端可并行构建：

```bash
# 后端构建（设置 Java 17）
export JAVA_HOME="/c/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"
cd E:/my_projects/gio && mvn clean package -DskipTests

# 前端构建
cd E:/my_projects/gio/gio-web && pnpm install && pnpm build
```

### 2. 上传到服务器

使用 Python + paramiko 上传文件：

```python
# 上传 JAR 包
sftp.put('E:/my_projects/gio/gio-api/target/gio-api-1.0.0.jar', '/home/ubuntu/gio/gio-api-1.0.0.jar')

# 上传前端文件（递归）
upload_directory(sftp, 'E:/my_projects/gio/gio-web/dist', '/home/ubuntu/gio/static')
```

### 3. 远程部署

停止旧服务，启动新服务，重启 Nginx：

```bash
# 停止旧 Java 进程
pkill -f "gio-api.*jar"

# 启动新后端
cd ~/gio && nohup java -jar gio-api-1.0.0.jar --server.port=8081 > logs/api.log 2>&1 &

# 重启 Nginx（处理 HTTPS 和反向代理）
sudo systemctl restart nginx
```

### 4. 健康验证

验证所有访问方式：

| 地址 | 预期响应 | 说明 |
|------|----------|------|
| http://140.143.87.54 | 301 | HTTP 重定向到 HTTPS |
| https://140.143.87.54 | 200 | HTTPS IP 访问 |
| https://gio-ai.cn | 200 | 域名 HTTPS 访问 |
| https://gio-ai.cn/api/categories | 200 | API 接口 |

## 访问地址

部署完成后：
- **官网**: https://gio-ai.cn
- **官网 (IP)**: https://140.143.87.54
- **API**: https://gio-ai.cn/api/...

## 日志查看

```bash
ssh ubuntu@140.143.87.54
tail -f ~/gio/logs/api.log          # 后端日志
sudo journalctl -u nginx -f         # Nginx 日志
```

## 常见问题

### HTTPS 无法访问
检查 Nginx 是否运行：
```bash
sudo systemctl status nginx
sudo systemctl start nginx
```

### 前端文件未更新
检查静态文件目录：
```bash
ls -la ~/gio/static/
```

### API 返回错误
检查后端进程和日志：
```bash
ps aux | grep java
tail -50 ~/gio/logs/api.log
```