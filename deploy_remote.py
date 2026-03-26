#!/usr/bin/env python3
import paramiko
import time
import sys

HOST = '140.143.87.54'
PORT = 22
USERNAME = 'ubuntu'
PASSWORD = '@yuku007@'

def run_cmd(shell, cmd, wait=3, timeout=60):
    shell.send(cmd + '\n')
    start = time.time()
    output = ""
    while time.time() - start < timeout:
        try:
            time.sleep(wait)
            data = shell.recv(4096)
            if data:
                output += data.decode('utf-8', errors='ignore')
                # 检查命令是否完成（简单的提示符检测）
                if '$' in output or '#' in output:
                    break
        except:
            break
    return output

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD, timeout=60)

shell = client.invoke_shell()
shell.settimeout(120)
time.sleep(3)
shell.recv(65535)

print("1. 删除旧目录并重新克隆...")
print(run_cmd(shell, 'rm -rf ~/gio', 5))
print(run_cmd(shell, 'cd ~ && git clone https://github.com/zycd007/gio.git', 60))

print("2. 设置 Java 环境...")
run_cmd(shell, 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64', 2)

print("3. 检查 Maven...")
print(run_cmd(shell, 'which mvn', 3))

print("4. 构建后端 (这可能需要几分钟)...")
shell.send('cd ~/gio && export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 && mvn clean package -DskipTests\n')

# 等待构建完成
build_output = ""
build_done = False
while not build_done:
    time.sleep(15)
    try:
        data = shell.recv(8192)
        if data:
            build_output += data.decode('utf-8', errors='ignore')
            if 'BUILD SUCCESS' in build_output:
                print("✓ 后端构建成功")
                build_done = True
                break
            elif 'BUILD FAILURE' in build_output:
                print("✗ 后端构建失败")
                print(build_output)
                build_done = True
                break
    except:
        pass
    print(".", end="", flush=True)

print("\n5. 检查 jar 文件...")
print(run_cmd(shell, 'ls ~/gio/gio-portal/target/*.jar', 3))
print(run_cmd(shell, 'ls ~/gio/gio-admin/target/*.jar', 3))

print("6. 停止旧服务...")
run_cmd(shell, 'pkill -f "gio" 2>/dev/null || true', 3)
run_cmd(shell, 'pkill -f "vite" 2>/dev/null || true', 3)
run_cmd(shell, 'sleep 2', 2)

print("7. 创建目录...")
run_cmd(shell, 'mkdir -p ~/gio/logs ~/gio/uploads', 2)

print("8. 部署后端服务...")
run_cmd(shell, 'cd ~/gio && nohup java -jar gio-portal/target/gio-portal-1.0.0.jar --server.port=8081 > ~/gio/logs/portal.log 2>&1 &', 5)
run_cmd(shell, 'cd ~/gio && nohup java -jar gio-admin/target/gio-admin-1.0.0.jar --server.port=8082 > ~/gio/logs/admin.log 2>&1 &', 5)

print("9. 安装 pnpm...")
output = run_cmd(shell, 'which pnpm', 3)
if 'pnpm' not in output:
    print(run_cmd(shell, 'npm install -g pnpm', 30))

print("10. 构建前端...")
print(run_cmd(shell, 'cd ~/gio/gio-web && pnpm install', 90))
print(run_cmd(shell, 'cd ~/gio/gio-web && pnpm build', 90))

print("11. 部署前端...")
run_cmd(shell, 'cd ~/gio/gio-web && nohup pnpm preview --port 80 --host 0.0.0.0 > ~/gio/logs/frontend.log 2>&1 &', 5)

print("12. 检查服务状态...")
print(run_cmd(shell, 'netstat -tlnp 2>/dev/null | grep -E "(8081|8082|80)" || ss -tlnp | grep -E "(8081|8082|80)"', 5))

print("\n" + "="*50)
print("部署完成!")
print("前端: http://140.143.87.54")
print("后端: http://140.143.87.54:8081")
print("管理后台: http://140.143.87.54:8082")
print("="*50)

client.close()