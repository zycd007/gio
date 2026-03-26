#!/usr/bin/env python3
import paramiko
import time
import os

HOST = '140.143.87.54'
PORT = 22
USERNAME = 'ubuntu'
PASSWORD = '@yuku007@'

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=60)

sftp = client.open_sftp()

# 1. 上传 jar 文件
print("1. 上传 jar 文件...")
sftp.put('E:/my_projects/gio/gio-portal/target/gio-portal-1.0.0.jar', '/tmp/gio-portal-1.0.0.jar')
sftp.put('E:/my_projects/gio/gio-admin/target/gio-admin-1.0.0.jar', '/tmp/gio-admin-1.0.0.jar')
print("   jar 文件上传完成")

# 2. 上传前端文件
print("2. 上传前端文件...")
# 先删除旧的 dist 目录内容，然后上传新的
shell = client.invoke_shell()
shell.settimeout(30)
shell.send('rm -rf /tmp/dist\n')
time.sleep(2)
shell.recv(65535)

# 使用 put 上传整个目录
for root, dirs, files in os.walk('E:/my_projects/gio/gio-web/dist'):
    rel_path = os.path.relpath(root, 'E:/my_projects/gio/gio-web/dist')
    remote_dir = '/tmp/dist' if rel_path == '.' else f'/tmp/dist/{rel_path}'

    # 创建远程目录
    try:
        sftp.stat(remote_dir)
    except:
        sftp.mkdir(remote_dir)

    for file in files:
        local_file = os.path.join(root, file)
        remote_file = f'{remote_dir}/{file}'
        sftp.put(local_file, remote_file)
        print(f"   上传: {rel_path}/{file}")

print("   前端文件上传完成")

# 3. 服务器部署
print("3. 服务器部署...")

shell.send('''mkdir -p ~/gio/logs ~/gio/uploads ~/gio/static
mv /tmp/gio-*.jar ~/gio/
rm -rf ~/gio/static/*
mv /tmp/dist/* ~/gio/static/
pkill -f "gio-.*\.jar" 2>/dev/null || true
pkill -f "python3.*http.server" 2>/dev/null || true
sleep 2
cd ~/gio && nohup java -jar gio-portal-1.0.0.jar --server.port=8081 > ~/gio/logs/portal.log 2>&1 &
cd ~/gio && nohup java -jar gio-admin-1.0.0.jar --server.port=8082 > ~/gio/logs/admin.log 2>&1 &
cd ~/gio/static && nohup python3 -m http.server 80 > ~/gio/logs/frontend.log 2>&1 &
''' + '\n')

time.sleep(5)
shell.recv(65535)

# 4. 检查状态
print("4. 检查服务状态...")
shell.send('netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)" || ss -tlnp | grep -E "(8081|8082|80)"\n')
time.sleep(3)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

print("\n" + "="*50)
print("部署完成!")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")
print("="*50)

sftp.close()
client.close()