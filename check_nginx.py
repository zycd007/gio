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

# 查看现有的 gio nginx 配置
print("查看现有的 nginx 配置...")
shell.send('cat /etc/nginx/sites-available/gio\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

# 检查静态文件是否存在
print("\n检查静态文件...")
shell.send('ls -la ~/gio/static/\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

# 检查 nginx 进程
print("\n检查 nginx...")
shell.send('ps aux | grep nginx | head -5\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

client.close()