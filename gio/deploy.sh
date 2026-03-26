#!/bin/bash
# 在服务器上执行此脚本完成部署

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
cd ~/gio

echo "===== 构建后端 ====="
mvn clean package -DskipTests

echo "===== 停止旧服务 ====="
pkill -f "gio-.*\.jar" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "===== 创建目录 ====="
mkdir -p logs uploads

echo "===== 部署后端 ====="
nohup java -jar gio-portal/target/gio-portal-1.0.0.jar --server.port=8081 > logs/portal.log 2>&1 &
nohup java -jar gio-admin/target/gio-admin-1.0.0.jar --server.port=8082 > logs/admin.log 2>&1 &

echo "===== 构建前端 ====="
cd gio-web
pnpm install
pnpm build

echo "===== 部署前端 ====="
nohup pnpm preview --port 80 --host 0.0.0.0 > ../logs/frontend.log 2>&1 &

echo "===== 完成 ====="
echo "前端: http://140.143.87.54"
echo "后端: http://140.143.87.54:8081"
echo "管理后台: http://140.143.87.54:8082"