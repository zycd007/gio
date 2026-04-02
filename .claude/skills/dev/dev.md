# dev

重启本地前后端所有项目。

## 使用方式

```
/dev
```

## 功能说明

执行以下步骤完成本地开发环境的重启：

### 1. 停止旧进程

**Windows PowerShell:**
```powershell
# 停止 Java 进程 (后端)
Get-Process java -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*gio*" } | Stop-Process -Force

# 停止 Node 进程 (前端 Vite)
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force
```

**Linux/Mac:**
```bash
pkill -f "gio-.*\.jar"
pkill -f "vite"
```

### 2. 设置环境变量

**Windows:**
```powershell
$env:JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

**Linux/Mac:**
```bash
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"
```

### 3. 启动服务

**方式一：分开启动（推荐，可以看到日志）**

```bash
# 终端 1 - C 端后端
cd gio-portal
mvn spring-boot:run

# 终端 2 - 后台后端
cd gio-admin
mvn spring-boot:run

# 终端 3 - 前端
cd gio-web
pnpm dev
```

**方式二：后台运行**

```bash
# Windows PowerShell
cd gio-portal; Start-Process mvn -ArgumentList "spring-boot:run" -WindowStyle Hidden
cd gio-admin; Start-Process mvn -ArgumentList "spring-boot:run" -WindowStyle Hidden
cd gio-web; Start-Process pnpm -ArgumentList "dev" -WindowStyle Hidden
```

## 服务列表

| 服务 | 端口 | 说明 |
|------|------|------|
| gio-portal | 8081 | C 端官网后端 |
| gio-admin | 8082 | 后台管理后端 |
| gio-web | 5173 | 前端开发服务器 |

## 访问地址

- **C 端官网**: http://localhost:8081
- **后台管理**: http://localhost:8082
- **前端开发**: http://localhost:5173

## 注意事项

- 确保数据库服务正在运行
- 确保端口 8081、8082 和 5173 未被占用
- 前端需要使用 `pnpm dev` 启动开发服务器
