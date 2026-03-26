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

# 杀掉占用 80 端口的进程，用 sudo
print("杀掉占用 80 端口的进程...")
shell.send('sudo kill -9 2773795\n')
time.sleep(2)
shell.recv(65535)

# 重新部署前端
print("部署前端...")
shell.send('cd ~/gio/static && nohup python3 -m http.server 80 > ~/gio/logs/frontend.log 2>&1 &\n')
time.sleep(3)

# 检查状态
shell.send('netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)" || ss -tlnp | grep -E "(8081|8082|80)"\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

print("\n========== 部署完成 ==========")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")

client.close()