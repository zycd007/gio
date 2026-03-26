#!/bin/bash
# 服务器部署脚本 - 在腾讯云服务器上执行

APP_DIR=$HOME/gio
LOG_DIR=$APP_DIR/logs
JAR_PORTAL=gio-portal-1.0.0.jar
JAR_ADMIN=gio-admin-1.0.0.jar

echo "=========================================="
echo "GIO 项目部署脚本"
echo "=========================================="

# 创建目录
echo "Creating directories..."
mkdir -p $APP_DIR
mkdir -p $LOG_DIR
mkdir -p $APP_DIR/uploads

# 停止现有服务
echo ""
echo "Stopping existing services..."
pkill -f "$JAR_PORTAL" 2>/dev/null || true
pkill -f "$JAR_ADMIN" 2>/dev/null || true
sleep 2

# 备份旧版本
echo ""
echo "Backing up old versions..."
if [ -f "$APP_DIR/$JAR_PORTAL" ]; then
    cp $APP_DIR/$JAR_PORTAL $APP_DIR/backup-$JAR_PORTAL-$(date +%Y%m%d-%H%M%S)
fi
if [ -f "$APP_DIR/$JAR_ADMIN" ]; then
    cp $APP_DIR/$JAR_ADMIN $APP_DIR/backup-$JAR_ADMIN-$(date +%Y%m%d-%H%M%S)
fi

# 设置权限
chmod +x $APP_DIR/*.jar

# 启动服务
echo ""
echo "Starting Portal service on port 8081..."
nohup java -jar $APP_DIR/$JAR_PORTAL --server.port=8081 > $LOG_DIR/portal.log 2>&1 &

echo "Starting Admin service on port 8082..."
nohup java -jar $APP_DIR/$JAR_ADMIN --server.port=8082 > $LOG_DIR/admin.log 2>&1 &

sleep 5

# 检查服务状态
echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="
ps aux | grep -E "(gio-portal|gio-admin)" | grep -v grep || echo "No running processes found"

echo ""
echo "Port status:"
netstat -tlnp 2>/dev/null | grep -E "(8081|8082)" || ss -tlnp 2>/dev/null | grep -E "(8081|8082)" || echo "Please check ports manually"

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Portal: http://140.143.87.54:8081"
echo "Admin:  http://140.143.87.54:8082"
echo "Logs:   $LOG_DIR"