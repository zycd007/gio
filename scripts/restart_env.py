#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GIO 项目环境重启脚本
支持重启本地开发环境或腾讯云服务器生产环境
"""

import os
import sys
import subprocess
import time
import shutil

# 配置
SERVER_CONFIG = {
    'host': '140.143.87.54',
    'port': 22,
    'username': 'ubuntu',
    'password': '@yuku007@',
    'db_password': '@Yuku007@'
}

JAVA_HOME = r"C:\Users\Administrator\.jdks\ms-17.0.17"
PROJECT_ROOT = r"E:\my_projects\gio"
GIO_API_DIR = os.path.join(PROJECT_ROOT, "gio-api")
GIO_WEB_DIR = os.path.join(PROJECT_ROOT, "gio-web")

def set_java_home():
    """设置 JAVA_HOME 环境变量"""
    os.environ['JAVA_HOME'] = JAVA_HOME
    os.environ['PATH'] = os.path.join(JAVA_HOME, 'bin') + os.pathsep + os.environ.get('PATH', '')
    print(f"[INFO] 设置 JAVA_HOME={JAVA_HOME}")

def run_command(cmd, shell=True, cwd=None, capture=False):
    """执行命令"""
    print(f"[CMD] {cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            cwd=cwd,
            capture_output=capture,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        if result.stdout:
            print(result.stdout)
        if result.returncode != 0 and result.stderr:
            print(f"[ERROR] {result.stderr}")
        return result.returncode == 0, result.stdout or ""
    except Exception as e:
        print(f"[ERROR] 命令执行失败：{e}")
        return False, ""

def check_local_port(port):
    """检查端口是否被占用"""
    success, output = run_command(f'netstat -ano | findstr :{port}', capture=True)
    return success and len(output.strip()) > 0

def stop_local_service(port):
    """停止占用端口的服务"""
    success, output = run_command(f'netstat -ano | findstr :{port}', capture=True)
    if not success or not output.strip():
        print(f"[INFO] 端口 {port} 没有被占用")
        return True

    # 解析 PID
    for line in output.strip().split('\n'):
        parts = line.split()
        if len(parts) >= 5 and f':{port}' in parts[1]:
            pid = parts[-1]
            print(f"[INFO] 发现进程占用端口 {port}, PID={pid}, 正在停止...")
            run_command(f'taskkill /F /PID {pid}')
            time.sleep(2)
            return True
    return True

def start_local_frontend():
    """启动本地前端服务"""
    print("\n[启动前端服务 (5173 端口)]")

    # 检查前端是否已运行
    if check_local_port(5173):
        print("[INFO] 前端服务已运行，跳过启动")
        return True

    # 启动前端
    print("[INFO] 启动前端开发服务器...")
    cmd = f'start "GIO Web" cmd /k "cd /d {GIO_WEB_DIR} && pnpm dev"'
    success, _ = run_command(cmd)

    if success:
        time.sleep(3)
        if check_local_port(5173):
            print("[SUCCESS] 前端服务已启动")
            print("访问地址：http://localhost:5173")
            print("后台管理：http://localhost:5173/admin/")
            return True
        else:
            print("[WARNING] 前端可能还在启动中")
            return True
    return False

def restart_local():
    """重启本地前后端服务"""
    print("\n" + "="*50)
    print("重启本地 GIO 开发环境")
    print("="*50)

    set_java_home()

    # 停止现有服务
    print("\n[1/4] 停止现有服务...")
    stop_local_service(8081)  # 后端
    stop_local_service(5173)  # 前端

    # 启动后端
    print("\n[2/4] 启动后端服务 (8081)...")
    print("[INFO] 使用后台模式启动服务，服务将在后台运行")

    cmd = f'start "GIO API" cmd /k "cd /d {GIO_API_DIR} && mvn spring-boot:run"'
    success, _ = run_command(cmd)

    # 启动前端
    print("\n[3/4] 启动前端服务 (5173)...")
    start_local_frontend()

    if success:
        print("\n[4/4] 等待服务启动...")
        time.sleep(10)

        # 验证服务
        print("验证服务是否启动成功...")
        time.sleep(5)
        api_ready = check_local_port(8081)
        web_ready = check_local_port(5173)

        print("\n" + "="*50)
        print("服务状态")
        print("="*50)
        print(f"  后端 API: {'✓ 运行中' if api_ready else '○ 启动中'}")
        print(f"  前端 Web: {'✓ 运行中' if web_ready else '○ 启动中'}")

        if api_ready and web_ready:
            print("\n[SUCCESS] 本地开发环境重启完成!")
        else:
            print("\n[INFO] 服务正在启动，请稍后访问")

        print("\n访问地址:")
        print("  C端官网:  http://localhost:5173")
        print("  后台管理: http://localhost:5173/admin/")
        print("  API接口:  http://localhost:8081")
        return True
    else:
        print("[ERROR] 启动服务失败")
        return False

def ssh_command(cmd, timeout=60):
    """使用 paramiko 执行 SSH 命令"""
    try:
        import paramiko
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        print(f"[SSH] 连接到 {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}")
        client.connect(
            hostname=SERVER_CONFIG['host'],
            port=SERVER_CONFIG['port'],
            username=SERVER_CONFIG['username'],
            password=SERVER_CONFIG['password'],
            timeout=10
        )

        print(f"[SSH] 执行命令：{cmd}")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)

        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')

        if output:
            print(output)
        if error:
            print(f"[ERROR] {error}")

        client.close()
        return len(error.strip()) == 0, output
    except ImportError:
        print("[ERROR] 未安装 paramiko 库，请运行：pip install paramiko")
        return False, ""
    except Exception as e:
        print(f"[SSH ERROR] {e}")
        return False, str(e)

def ssh_upload(local_path, remote_path):
    """使用 paramiko 上传文件"""
    try:
        import paramiko
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        print(f"[SSH] 连接到 {SERVER_CONFIG['username']}@{SERVER_CONFIG['host']}")
        client.connect(
            hostname=SERVER_CONFIG['host'],
            port=SERVER_CONFIG['port'],
            username=SERVER_CONFIG['username'],
            password=SERVER_CONFIG['password'],
            timeout=10
        )

        sftp = client.open_sftp()
        print(f"[SFTP] 上传 {local_path} -> {remote_path}")

        # 确保远程目录存在
        remote_dir = os.path.dirname(remote_path)
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            print(f"[SFTP] 创建远程目录：{remote_dir}")
            sftp.makedirs(remote_dir)

        sftp.put(local_path, remote_path)
        sftp.close()
        client.close()
        print(f"[SUCCESS] 上传完成：{remote_path}")
        return True
    except Exception as e:
        print(f"[SFTP ERROR] {e}")
        return False

def restart_server():
    """重启服务器生产环境"""
    print("\n" + "="*50)
    print("部署到腾讯云服务器")
    print("="*50)

    set_java_home()

    # 1. 本地构建
    print("\n[1/5] 本地构建后端...")
    success, _ = run_command('mvn clean package -DskipTests', cwd=PROJECT_ROOT)
    if not success:
        print("[ERROR] 后端构建失败")
        return False

    print("\n[2/5] 本地构建前端...")
    # 先安装依赖
    run_command('pnpm install', cwd=GIO_WEB_DIR)
    success, _ = run_command('pnpm build', cwd=GIO_WEB_DIR)
    if not success:
        print("[ERROR] 前端构建失败")
        return False

    # 3. 上传文件
    print("\n[3/5] 上传文件到服务器...")
    jar_path = os.path.join(PROJECT_ROOT, "gio-api", "target", "gio-api-1.0.0.jar")
    if not os.path.exists(jar_path):
        print(f"[ERROR] JAR 文件不存在：{jar_path}")
        return False

    success = ssh_upload(jar_path, "/tmp/gio-api-1.0.0.jar")
    if not success:
        print("[ERROR] 上传 JAR 失败")
        return False

    dist_dir = os.path.join(GIO_WEB_DIR, "dist")
    if os.path.exists(dist_dir):
        # 打包 dist 目录
        print("打包前端文件...")
        shutil.make_archive(r"/tmp/gio-web-dist", 'zip', dist_dir)
        success = ssh_upload(r"/tmp/gio-web-dist.zip", "/tmp/dist.zip")
        if not success:
            print("[WARNING] 上传前端文件失败，但继续部署后端")

    # 4. 服务器部署
    print("\n[4/5] 服务器部署...")
    deploy_cmds = [
        "mkdir -p ~/gio/logs ~/gio/uploads ~/gio/static",
        "mv /tmp/gio-api-1.0.0.jar ~/gio/ || true",
        "unzip -o /tmp/dist.zip -d ~/gio/static/ 2>/dev/null || true",
        "pkill -f 'gio' 2>/dev/null || true",
        "sleep 1",
        "nohup java -jar ~/gio/gio-api-1.0.0.jar --server.port=8081 > ~/gio/logs/api.log 2>&1 &",
        "sleep 2",
        "cd ~/gio/static && nohup python3 -m http.server 80 > ~/gio/logs/frontend.log 2>&1 &",
    ]

    for cmd in deploy_cmds:
        success, _ = ssh_command(cmd, timeout=30)
        time.sleep(1)

    # 5. 验证
    print("\n[5/5] 验证部署...")
    time.sleep(5)
    success, output = ssh_command('netstat -tlnp | grep -E "(8081|80)"', timeout=10)
    if success:
        print("\n[SUCCESS] 服务器部署完成!")
        print("访问地址：http://140.143.87.54")
        print("API 地址：http://140.143.87.54:8081")
    else:
        print("[WARNING] 服务可能还在启动中")

    # 查看日志
    print("\n最近日志:")
    ssh_command('tail -20 ~/gio/logs/api.log', timeout=10)

    return True

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("""
GIO 环境重启脚本

用法:
    python restart_env.py --local     重启本地后端服务
    python restart_env.py --server    部署到腾讯云服务器
    python restart_env.py --both      同时重启本地和服务器
    python restart_env.py             默认只重启本地
        """)
        sys.argv.append('--local')

    action = sys.argv[1].lower()

    if action == '--local' or action == 'local':
        success = restart_local()
        sys.exit(0 if success else 1)
    elif action == '--server' or action == 'server':
        success = restart_server()
        sys.exit(0 if success else 1)
    elif action == '--both' or action == 'both':
        print("先重启本地服务...")
        restart_local()
        print("\n" + "="*50)
        print("准备部署服务器...")
        restart_server()
    else:
        print(f"[ERROR] 未知参数：{action}")
        print("使用 --local 或 --server")
        sys.exit(1)

if __name__ == '__main__':
    main()
