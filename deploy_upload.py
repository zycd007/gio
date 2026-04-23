import paramiko
import os
import stat

# 服务器信息
SERVER_IP = '140.143.87.54'
SERVER_USER = 'ubuntu'
SERVER_PASSWORD = '@yuku007@'

# 本地路径
LOCAL_JAR = 'E:/my_projects/gio/gio-api/target/gio-api-1.0.0.jar'
LOCAL_DIST = 'E:/my_projects/gio/gio-web/dist'

# 远程路径
REMOTE_JAR = '/home/ubuntu/gio/gio-api-1.0.0.jar'
REMOTE_STATIC = '/home/ubuntu/gio/static'

def upload_directory(sftp, local_dir, remote_dir):
    """递归上传目录"""
    # 确保远程目录存在
    try:
        sftp.stat(remote_dir)
        # 清空远程目录
        for item in sftp.listdir(remote_dir):
            remote_path = os.path.join(remote_dir, item).replace('\\', '/')
            try:
                sftp.stat(remote_path)
                if stat.S_ISDIR(sftp.stat(remote_path).st_mode):
                    # 递归删除目录
                    for sub_item in sftp.listdir(remote_path):
                        sub_remote = os.path.join(remote_path, sub_item).replace('\\', '/')
                        sftp.remove(sub_remote)
                    sftp.rmdir(remote_path)
                else:
                    sftp.remove(remote_path)
            except:
                pass
    except:
        sftp.mkdir(remote_dir)

    # 上传本地文件
    for root, dirs, files in os.walk(local_dir):
        # 计算相对路径
        rel_path = os.path.relpath(root, local_dir)
        remote_path = os.path.join(remote_dir, rel_path).replace('\\', '/')

        # 创建远程子目录
        if rel_path != '.':
            try:
                sftp.mkdir(remote_path)
            except:
                pass

        # 上传文件
        for file in files:
            local_file = os.path.join(root, file)
            remote_file = os.path.join(remote_path, file).replace('\\', '/')
            print(f'上传: {file} -> {remote_file}')
            sftp.put(local_file, remote_file)

def main():
    # 连接服务器
    print('连接服务器...')
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_IP, username=SERVER_USER, password=SERVER_PASSWORD)
    sftp = client.open_sftp()

    try:
        # 上传 JAR 包
        print(f'上传 JAR 包: {LOCAL_JAR} -> {REMOTE_JAR}')
        sftp.put(LOCAL_JAR, REMOTE_JAR)
        print('JAR 包上传完成')

        # 上传前端文件
        print(f'上传前端文件: {LOCAL_DIST} -> {REMOTE_STATIC}')
        upload_directory(sftp, LOCAL_DIST, REMOTE_STATIC)
        print('前端文件上传完成')

    finally:
        sftp.close()
        client.close()
        print('连接关闭')

if __name__ == '__main__':
    main()