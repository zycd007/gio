#!/usr/bin/env python3
import paramiko
import time

HOST = '140.143.87.54'
PORT = 22
USERNAME = 'ubuntu'
PASSWORD = '@yuku007@'

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=60)

# 先克隆代码
print("检查代码目录...")
shell = client.invoke_shell()
shell.settimeout(60)
time.sleep(2)
shell.recv(65535)

shell.send('ls -la ~/gio/ 2>/dev/null || echo "目录不存在"\n')
time.sleep(3)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

if '不存在' in output or 'No such' in output:
    print("克隆代码...")
    shell.send('cd ~ && git clone https://github.com/zycd007/gio.git\n')
    time.sleep(60)
    shell.recv(65535)

# 上传部署脚本
print("上传部署脚本...")
sftp = client.open_sftp()
sftp.put('E:/my_projects/gio/gio/deploy.sh', '/home/ubuntu/gio/deploy.sh')
sftp.chmod('/home/ubuntu/gio/deploy.sh', 0o755)
sftp.close()

# 执行部署脚本
print("执行部署脚本...")
shell.send('cd ~/gio && bash deploy.sh\n')

# 持续获取输出
while True:
    time.sleep(30)
    try:
        output = shell.recv(8192).decode('utf-8', errors='ignore')
        print(output)
        if '===== 完成 =====' in output or 'BUILD SUCCESS' in output:
            break
    except Exception as e:
        break

# 检查最终状态
print("\n检查服务状态...")
shell.send('netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)"\n')
time.sleep(3)
output = shell.recv(4096).decode('utf-8', errors='ignore')
print(output)

print("\n========== 部署完成 ==========")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")

client.close()