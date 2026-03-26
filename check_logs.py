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

# 检查日志
print("=== Portal 日志 ===")
shell.send('tail -20 ~/gio/logs/portal.log\n')
time.sleep(2)
output = shell.recv(8192).decode('utf-8', errors='ignore')
print(output)

print("\n=== Admin 日志 ===")
shell.send('tail -20 ~/gio/logs/admin.log\n')
time.sleep(2)
output = shell.recv(8192).decode('utf-8', errors='ignore')
print(output)

print("\n=== 前端日志 ===")
shell.send('tail -20 ~/gio/logs/frontend.log\n')
time.sleep(2)
output = shell.recv(8192).decode('utf-8', errors='ignore')
print(output)

client.close()