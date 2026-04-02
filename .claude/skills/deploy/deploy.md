# deploy

一键部署 GIO 项目到腾讯云服务器。

## 使用方式

```
/deploy
```

或直接执行脚本：

```bash
python .claude/skills/deploy/scripts/deploy.py
```

## 功能说明

### 部署流程

1. **本地构建** - 使用 Maven 增量编译后端，使用 pnpm 构建前端
2. **准备文件** - 复制 jar 包并压缩前端 dist 目录
3. **上传文件** - 通过 SFTP 上传到腾讯云服务器
4. **部署服务** - 停止旧服务，解压文件，启动新服务
5. **验证部署** - 智能等待服务启动，检查端口和 HTTP 响应

### 优化特点

| 特性 | 说明 |
|------|------|
| 增量编译 | 跳过 clean 步骤，复用上次编译结果 |
| 无密码部署 | 完全使用 paramiko，无需密码输入 |
| 重试机制 | SSH 连接失败自动重试 (最多 2 次) |
| 智能等待 | 等待端口监听，确保服务完全启动 |
| 完整验证 | 检查前端、Portal API、Admin API |
| 错误处理 | 完善的异常捕获和错误提示 |
| 日志输出 | 彩色终端输出，清晰的任务状态 |
| 临时清理 | 自动清理服务器临时文件 |

## 服务器配置

| 配置项 | 值 |
|--------|-----|
| 服务器 IP | 140.143.87.54 |
| 用户名 | ubuntu |
| 密码 | @yuku007@ |
| 部署路径 | /home/ubuntu/gio |
| Portal 端口 | 8081 |
| Admin 端口 | 8082 |
| 前端端口 | 80 |

## 部署后访问

| 服务 | 地址 |
|------|------|
| 前端页面 | http://140.143.87.54 |
| Portal API | http://140.143.87.54:8081 |
| Admin 后台 | http://140.143.87.54:8082/admin/ |

## 配置说明

### 超时配置

```python
SSH_TIMEOUT = 60          # SSH 连接超时 (秒)
SFTP_TIMEOUT = 300        # SFTP 传输超时 (秒)
SERVICE_START_TIMEOUT = 45  # 服务启动最大等待 (秒)
VERIFICATION_TIMEOUT = 10   # HTTP 验证超时 (秒)
```

### 重试配置

```python
MAX_RETRIES = 2    # 最大重试次数
RETRY_DELAY = 5    # 重试间隔 (秒)
```

## 日志查看

### 本地日志
部署日志直接输出到终端

### 服务器日志

```bash
# 登录服务器
ssh ubuntu@140.143.87.54

# 查看 Portal 日志
tail -f ~/gio/logs/portal.log

# 查看 Admin 日志
tail -f ~/gio/logs/admin.log

# 查看前端日志
tail -f ~/gio/logs/frontend.log
```

## 手动验证命令

```bash
# 检查服务进程
ps aux | grep gio

# 检查端口监听
netstat -tlnp | grep -E "(8081|8082|80)"

# 测试 API
curl http://140.143.87.54:8081/api/categories
curl http://140.143.87.54:8082/api/admin/login
```

## 常见问题

### Q1: 部署后服务无法访问

**可能原因：**
- 服务启动失败
- 端口被占用
- 防火墙阻止

**解决方案：**
```bash
# 1. 查看日志
tail -f ~/gio/logs/admin.log

# 2. 检查端口
netstat -tlnp | grep 8082

# 3. 手动启动
cd ~/gio
java -jar gio-admin-1.0.0.jar --server.port=8082
```

### Q2: 上传速度慢

**解决方案：**
- 检查本地网络连接
- 检查服务器带宽
- 前端打包文件过大时可优化图片资源

### Q3: 构建失败

**可能原因：**
- JAVA_HOME 未正确设置
- Maven 未安装或版本不兼容
- 代码编译错误

**解决方案：**
```bash
# 检查 Java 环境
java -version

# 检查 Maven
mvn -version

# 清理后重新构建
mvn clean package -DskipTests
```

## 部署时间参考

| 阶段 | 耗时 |
|------|------|
| 本地构建 | 15-30s |
| 文件准备 | 1-2s |
| 文件上传 | 60-120s |
| 服务部署 | 5-10s |
| 验证等待 | 15-30s |
| **总计** | **约 2-3 分钟** |

## 注意事项

1. 确保本地 Python 环境已安装 `paramiko` 依赖
2. 确保本地已安装 Maven 和 pnpm
3. 部署前确保代码已提交到本地
4. 敏感操作建议先在测试环境验证
5. 部署过程中不要中断脚本执行

## 安全建议

生产环境建议：
- 修改默认密码
- 使用 SSH 密钥认证代替密码
- 配置 HTTPS
- 限制服务器访问 IP
- 定期备份数据库
