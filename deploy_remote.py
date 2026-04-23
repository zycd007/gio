import paramiko

# 服务器信息
SERVER_IP = '140.143.87.54'
SERVER_USER = 'ubuntu'
SERVER_PASSWORD = '@yuku007@'

def run_ssh_command(client, command):
    """执行 SSH 命令并返回输出"""
    stdin, stdout, stderr = client.exec_command(command)
    output = stdout.read().decode('utf-8')
    error = stderr.read().decode('utf-8')
    return output, error

def main():
    print('连接服务器...')
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_IP, username=SERVER_USER, password=SERVER_PASSWORD)

    try:
        # 1. 停止旧 Java 进程
        print('停止旧 Java 进程...')
        run_ssh_command(client, 'pkill -f "gio-api.*jar" || true')

        # 2. 确保目录存在
        print('确保目录存在...')
        run_ssh_command(client, 'mkdir -p ~/gio/logs ~/gio/uploads ~/gio/static')

        # 3. 启动新后端
        print('启动新后端服务...')
        run_ssh_command(client, 'cd ~/gio && nohup java -jar gio-api-1.0.0.jar --server.port=8081 > logs/api.log 2>&1 &')

        # 4. 等待后端启动
        print('等待后端启动...')
        import time
        time.sleep(5)

        # 5. 检查后端进程
        output, error = run_ssh_command(client, 'ps aux | grep gio-api | grep -v grep')
        print(f'后端进程状态:\n{output}')

        # 6. 重启 Nginx
        print('重启 Nginx...')
        output, error = run_ssh_command(client, 'sudo systemctl restart nginx')
        if error and 'password' in error.lower():
            # 需要密码的情况
            print('Nginx 重启需要 sudo 密码...')

        # 7. 检查 Nginx 状态
        output, error = run_ssh_command(client, 'sudo systemctl status nginx --no-pager')
        print(f'Nginx 状态:\n{output[:500]}')

        print('部署完成！')

    finally:
        client.close()
        print('连接关闭')

if __name__ == '__main__':
    main()