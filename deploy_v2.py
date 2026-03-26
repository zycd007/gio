#!/usr/bin/env python3
import paramiko
import time

HOST = '140.143.87.54'
PORT = 22
USERNAME = 'ubuntu'
PASSWORD = '@yuku007@'

def send_cmd(shell, cmd, wait=3):
    shell.send(cmd + '\n')
    time.sleep(wait)

def get_output(shell, timeout=5):
    time.sleep(timeout)
    try:
        return shell.recv(16384).decode('utf-8', errors='ignore')
    except:
        return ""

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=60)

shell = client.invoke_shell()
shell.settimeout(120)
time.sleep(3)
shell.recv(65535)

# 1. 检查目录
print("1. 检查目录...")
send_cmd(shell, 'ls -la ~/gio/')
print(get_output(shell))

# 2. 构建后端
print("2. 构建后端...")
send_cmd(shell, 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64')
send_cmd(shell, 'cd ~/gio && export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 && mvn clean package -DskipTests')

# 等待构建
print("等待 Maven 构建完成...")
for i in range(30):  # 最多等 5 分钟
    time.sleep(10)
    output = get_output(shell, 1)
    if 'BUILD SUCCESS' in output:
        print("✓ 后端构建成功")
        break
    if 'BUILD FAILURE' in output:
        print("✗ 构建失败")
        break
    print(".", end="", flush=True)

# 3. 检查 jar
print("\n3. 检查 jar 文件...")
send_cmd(shell, 'ls -la ~/gio/gio-portal/target/*.jar')
print(get_output(shell))

# 4. 停止旧服务
print("4. 停止旧服务...")
send_cmd(shell, 'pkill -f "gio-.*\.jar" 2>/dev/null || true')
send_cmd(shell, 'pkill -f "vite" 2>/dev/null || true')
send_cmd(shell, 'sleep 2')

# 5. 创建目录
send_cmd(shell, 'mkdir -p ~/gio/logs ~/gio/uploads')

# 6. 部署后端
print("6. 部署后端...")
send_cmd(shell, 'cd ~/gio && nohup java -jar gio-portal/target/gio-portal-1.0.0.jar --server.port=8081 > ~/gio/logs/portal.log 2>&1 &')
send_cmd(shell, 'cd ~/gio && nohup java -jar gio-admin/target/gio-admin-1.0.0.jar --server.port=8082 > ~/gio/logs/admin.log 2>&1 &')
time.sleep(5)

# 7. 检查 pnpm
print("7. 检查 pnpm...")
send_cmd(shell, 'which pnpm')
output = get_output(shell)
if 'pnpm' not in output:
    print("安装 pnpm...")
    send_cmd(shell, 'npm install -g pnpm')
    get_output(shell)

# 8. 构建前端
print("8. 构建前端...")
send_cmd(shell, 'cd ~/gio/gio-web && pnpm install')
print("安装依赖...")
for i in range(20):
    time.sleep(5)
    output = get_output(shell, 1)
    if 'added' in output.lower() or 'done' in output.lower():
        break
    print(".", end="", flush=True)

send_cmd(shell, 'cd ~/gio/gio-web && pnpm build')
print("构建前端...")
for i in range(20):
    time.sleep(5)
    output = get_output(shell, 1)
    if 'built' in output.lower() or 'done' in output.lower():
        break
    print(".", end="", flush=True)

# 9. 部署前端
print("\n9. 部署前端...")
send_cmd(shell, 'cd ~/gio/gio-web && nohup pnpm preview --port 80 --host 0.0.0.0 > ~/gio/logs/frontend.log 2>&1 &')
time.sleep(3)

# 10. 检查状态
print("10. 检查服务状态...")
send_cmd(shell, 'netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)"')
print(get_output(shell))

print("\n" + "="*50)
print("部署完成!")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")
print("="*50)

client.close()