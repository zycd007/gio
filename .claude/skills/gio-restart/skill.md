---
name: gio-restart
description: GIO 项目环境重启技能。当用户提到重启服务、重启环境、重新部署、服务卡死、端口占用、重启本地、重启服务器、deploy 等场景时使用此技能。通过参数控制重启本地开发环境 (--local) 或腾讯云服务器生产环境 (--server)。--local 模式会同时重启前后端服务。技能会自动调用 scripts/restart_env.py 脚本执行。
---

# GIO 环境重启技能

## 核心机制

此技能通过调用 Python 脚本 `scripts/restart_env.py` 来执行重启操作，该脚本已内置服务器密码，无需手动输入 SSH 密码。

**重要：`--local` 模式会同时重启前后端服务（8081 + 5173）。**

## 触发场景

使用此技能当用户：
- 要求重启服务（本地或服务器）
- 服务卡死、无响应、端口占用
- 代码修改后需要重新部署
- 说"deploy"、"上线"、"重启"、"重新部署"等

## 执行流程

### 1. 确认重启模式

告知用户将要执行的操作并获得确认：

**本地重启 (--local) - 同时重启前后端：**
> 即将重启本地 GIO 开发环境，包括：
> - 后端 API 服务（8081 端口）
> - 前端开发服务器（5173 端口）
>
> 这将停止当前运行的服务并重新启动。确认？

**服务器部署 (--server)：**
> 即将部署到腾讯云服务器，这将：
> 1. 本地构建后端和前端（约 2-3 分钟）
> 2. 上传文件到服务器
> 3. 重启服务器上的服务
>
> 确认部署？

### 2. 执行重启命令

**本地重启 (--local)：**
```bash
cd E:/my_projects/gio
python scripts/restart_env.py --local
```

**服务器部署 (--server)：**
```bash
cd E:/my_projects/gio
python scripts/restart_env.py --server
```

**同时重启 (--both)：**
```bash
cd E:/my_projects/gio
python scripts/restart_env.py --both
```

### 3. 验证结果

脚本执行完成后会显示服务状态：
```
服务状态
==================
  后端 API: ✓ 运行中
  前端 Web: ✓ 运行中

访问地址:
  C端官网:  http://localhost:5173
  后台管理: http://localhost:5173/admin/
  API接口:  http://localhost:8081
```

## 服务列表

| 服务 | 端口 | 启动命令 | 说明 |
|------|------|----------|------|
| gio-api | 8081 | `mvn spring-boot:run` | 后端 API |
| gio-web | 5173 | `pnpm dev` | 前端开发服务器 |

## 故障排查

**端口占用无法停止：**
```bash
# 后端端口
netstat -ano | findstr :8081
taskkill /F /PID <pid>

# 前端端口
netstat -ano | findstr :5173
taskkill /F /PID <pid>
```

**前端启动失败：**
```bash
# 手动启动前端
cd E:/my_projects/gio/gio-web
pnpm dev
```

**后端启动失败：**
```bash
# 检查 JAVA_HOME
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
cd E:/my_projects/gio/gio-api
mvn spring-boot:run
```

**查看服务器日志：**
```bash
ssh ubuntu@140.143.87.54 "tail -100 ~/gio/logs/api.log"
```

## 依赖检查

执行前确保：
1. Python 3 已安装
2. paramiko 库已安装（服务器部署需要）：`pip install paramiko`
3. JDK 17 路径正确：`C:/Users/Administrator/.jdks/ms-17.0.17`
4. 项目路径正确：`E:/my_projects/gio`
5. pnpm 已安装（前端需要）