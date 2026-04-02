#!/bin/bash

# GIO 本地开发环境重启脚本 (Windows Bash/Git Bash)
# 停止所有旧进程并启动前后端服务

set -e

echo "=== GIO 开发环境重启 ==="

# 1. 停止旧的 Java 进程 (Windows 任务管理器进程名是 java.exe)
echo "正在停止旧的后端进程..."
taskkill /F /IM java.exe 2>/dev/null || true

# 2. 停止旧的前端进程 (Node.js)
echo "正在停止旧的前端进程..."
taskkill /F /IM node.exe 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 3. 设置 Java 环境
export JAVA_HOME="C:/Users/Administrator/.jdks/ms-17.0.17"
export PATH="$JAVA_HOME/bin:$PATH"

# 4. 切换到项目目录
cd "/e/my_projects/gio"

# 5. 创建日志目录
mkdir -p logs

# 6. 启动后端服务（后台运行）
echo "正在启动 gio-portal (C 端后端 - 端口 8081)..."
cd gio-portal
nohup mvn spring-boot:run > ../logs/portal.log 2>&1 &
PORTAL_PID=$!

echo "正在启动 gio-admin (后台后端 - 端口 8082)..."
cd ../gio-admin
nohup mvn spring-boot:run > ../logs/admin.log 2>&1 &
ADMIN_PID=$!

# 7. 启动前端服务（后台运行）
echo "正在启动 gio-web (前端 - 端口 5173)..."
cd ../gio-web
nohup pnpm dev > ../logs/web.log 2>&1 &
WEB_PID=$!

# 8. 等待服务启动
echo ""
echo "等待服务启动..."
sleep 5

# 9. 验证服务状态
echo ""
echo "=== 服务状态 ==="

if ps -p $PORTAL_PID > /dev/null 2>&1; then
    echo "gio-portal: 运行中 (PID: $PORTAL_PID)"
else
    echo "gio-portal: 启动失败"
fi

if ps -p $ADMIN_PID > /dev/null 2>&1; then
    echo "gio-admin: 运行中 (PID: $ADMIN_PID)"
else
    echo "gio-admin: 启动失败"
fi

if ps -p $WEB_PID > /dev/null 2>&1; then
    echo "gio-web: 运行中 (PID: $WEB_PID)"
else
    echo "gio-web: 启动失败"
fi

echo ""
echo "=== 访问地址 ==="
echo "C 端官网：http://localhost:8081"
echo "后台管理：http://localhost:8082"
echo "前端开发：http://localhost:5173"
echo ""
echo "日志查看：tail -f logs/portal.log"
echo "         tail -f logs/admin.log"
echo "         tail -f logs/web.log"
