#!/bin/bash
# GIO 项目部署脚本

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
    mv $APP_DIR/$JAR_PORTAL $APP_DIR/backup-$JAR_PORTAL-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi
if [ -f "$APP_DIR/$JAR_ADMIN" ]; then
    mv $APP_DIR/$JAR_ADMIN $APP_DIR/backup-$JAR_ADMIN-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi

# 移动新jar包
echo ""
echo "Deploying new jar files..."
mv /tmp/$JAR_PORTAL $APP_DIR/
mv /tmp/$JAR_ADMIN $APP_DIR/

# 设置权限
chmod +x $APP_DIR/*.jar

# 启动服务
echo ""
echo "Starting Portal service on port 8081..."
nohup java -jar $APP_DIR/$JAR_PORTAL > $LOG_DIR/portal.log 2>&1 &

echo "Starting Admin service on port 8082..."
nohup java -jar $APP_DIR/$JAR_ADMIN > $LOG_DIR/admin.log 2>&1 &

sleep 3

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
echo ""
echo "Check logs:"
echo "  tail -f $LOG_DIR/portal.log"
echo "  tail -f $LOG_DIR/admin.log"
echo "=========================================="
