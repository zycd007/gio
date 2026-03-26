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

# 检查端口占用
shell.send('netstat -tlnp | grep -E "(8081|8082|80)"\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("端口状态:")
print(output)

# 检查日志
shell.send('cat ~/gio/logs/portal.log 2>/dev/null | tail -50\n')
time.sleep(2)
output = shell.recv(65535).decode('utf-8', errors='ignore')
print("\n后端日志:")
print(output)

client.close()