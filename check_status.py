#!/usr/bin/env python3
import paramiko
import time

HOST = '140.143.87.54'
PORT = 22
USERNAME = 'ubuntu'
PASSWORD = '@yuku007@'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=30)

shell = client.invoke_shell()
shell.settimeout(30)
time.sleep(2)
shell.recv(65535)

# 检查构建状态
shell.send('ps aux | grep -E "(mvn|java|node)" | grep -v grep\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("运行中的进程:")
print(output)

# 检查 jar 文件
shell.send('ls -la ~/gio/gio-portal/target/*.jar 2>/dev/null || echo "未找到"\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("\nPortal jar:")
print(output)

shell.send('ls -la ~/gio/gio-admin/target/*.jar 2>/dev/null || echo "未找到"\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("\nAdmin jar:")
print(output)

# 检查端口
shell.send('netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)" || ss -tlnp | grep -E "(8081|8082|80)"\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("\n端口状态:")
print(output)

client.close()