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

# 检查 nginx 配置
print("检查 nginx 配置目录...")
shell.send('ls -la /etc/nginx/sites-enabled/\n')
time.sleep(2)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

# 创建 nginx 配置
print("\n创建 nginx 配置...")
config = '''server {
    listen 80;
    server_name _;

    root /home/ubuntu/gio/static;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /admin {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
'''

shell.send('echo "' + config.replace('\n', '\\n') + '" | sudo tee /etc/nginx/sites-available/gio\n')
time.sleep(2)
shell.recv(65535)

# 启用配置
shell.send('sudo ln -sf /etc/nginx/sites-available/gio /etc/nginx/sites-enabled/\n')
time.sleep(2)

# 重新加载 nginx
shell.send('sudo nginx -t && sudo nginx -s reload\n')
time.sleep(3)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

print("\n========== 部署完成 ==========")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")

client.close()