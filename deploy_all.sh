#!/bin/bash
# GIO 项目一键部署脚本
# 在服务器上执行此脚本即可完成部署

set -e

echo "========== GIO 项目部署 =========="

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "安装 Java 17..."
    sudo apt update && sudo apt install -y openjdk-17-jdk
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "安装 pnpm..."
    npm install -g pnpm
fi

# 设置环境变量
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# 拉取代码
echo "拉取代码..."
if [ ! -d "~/gio" ]; then
    git clone https://github.com/zycd007/gio.git ~/gio
else
    cd ~/gio && git pull
fi

cd ~/gio

# 构建后端
echo "构建后端..."
mvn clean package -DskipTests

# 构建前端
echo "构建前端..."
cd gio-web
pnpm install
pnpm build

# 创建目录
echo "创建目录..."
mkdir -p ~/gio/logs ~/gio/uploads

# 停止旧服务
echo "停止旧服务..."
pkill -f "gio-.*\.jar" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# 部署后端
echo "部署后端服务..."
nohup java -jar gio-portal/target/gio-portal-1.0.0.jar --server.port=8081 > ~/gio/logs/portal.log 2>&1 &
nohup java -jar gio-admin/target/gio-admin-1.0.0.jar --server.port=8082 > ~/gio/logs/admin.log 2>&1 &

# 部署前端
echo "部署前端..."
cd gio-web
nohup pnpm preview --port 80 --host 0.0.0.0 > ~/gio/logs/frontend.log 2>&1 &

sleep 3

# 检查状态
echo ""
echo "========== 部署完成 =========="
echo "前端: http://140.143.87.54"
echo "后端: http://140.143.87.54:8081"
echo "管理后台: http://140.143.87.54:8082"
echo ""
echo "服务状态:"
ps aux | grep -E "(gio|vite)" | grep -v grep || echo "无运行中的服务"
echo ""
echo "日志查看:"
echo "  tail -f ~/gio/logs/portal.log"
echo "  tail -f ~/gio/logs/admin.log"
echo "  tail -f ~/gio/logs/frontend.log"
echo "=============================="