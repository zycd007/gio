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

# 检查什么进程占用 80 端口
print("检查 80 端口...")
shell.send('sudo lsof -i :80\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

# 使用 pnpm preview 来启动前端
print("\n使用 pnpm preview 启动前端...")
shell.send('cd ~/gio/static && pnpm create serve -l 80 .\n')
time.sleep(3)

# 或者直接用 npx serve
shell.send('cd ~/gio/static && npx -y serve -l 80 &\n')
time.sleep(5)

# 检查状态
shell.send('netstat -tlnp 2>/dev/null | grep 80 || ss -tlnp | grep 80\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print("\n端口状态:")
print(output)

print("\n========== 部署完成 ==========")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")

client.close()