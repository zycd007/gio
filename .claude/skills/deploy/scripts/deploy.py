#!/usr/bin/env python3
"""
GIO 项目部署脚本
支持：构建、上传、部署、验证、完整部署、查看日志

重要规则：
- 文件上传必须使用 paramiko（禁止使用 scp）
- 部署后必须确保 Nginx 运行（处理 HTTPS 和反向代理）
- 健康验证需检查 HTTPS 和域名访问
"""

import argparse
import os
import subprocess
import sys
import time
import paramiko

# 服务器配置
SERVER_IP = "140.143.87.54"
SERVER_USER = "ubuntu"
SERVER_PASSWORD = "@yuku007@"
SERVER_PORT = 22
DOMAIN = "gio-ai.cn"

# 项目路径配置（本地）
LOCAL_PROJECT_ROOT = "E:/my_projects/gio"
LOCAL_API_JAR = f"{LOCAL_PROJECT_ROOT}/gio-api/target/gio-api-1.0.0.jar"
LOCAL_WEB_DIST = f"{LOCAL_PROJECT_ROOT}/gio-web/dist"

# 远程路径配置
REMOTE_GIO_DIR = "/home/ubuntu/gio"
REMOTE_JAR_NAME = "gio-api-1.0.0.jar"
REMOTE_STATIC_DIR = f"{REMOTE_GIO_DIR}/static"
API_PORT = 8081

# Java 环境（Unix 路径格式，适用于 Git Bash）
JAVA_HOME_UNIX = "/c/Users/Administrator/.jdks/ms-17.0.17"


def get_ssh_client():
    """创建 SSH 连接"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_IP, port=SERVER_PORT, username=SERVER_USER, password=SERVER_PASSWORD)
    return client


def run_local_command(cmd, cwd=None):
    """执行本地命令"""
    print(f"[本地] 执行: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[错误] {result.stderr}")
        return False, result.stderr
    if result.stdout:
        print(result.stdout[:500] if len(result.stdout) > 500 else result.stdout)
    return True, result.stdout


def run_remote_command(client, cmd):
    """执行远程命令"""
    stdin, stdout, stderr = client.exec_command(cmd)
    output = stdout.read().decode()
    error = stderr.read().decode()
    return output, error


def build_backend():
    """构建后端（使用 Unix 路径格式设置 Java）"""
    print("\n========== 构建后端 ========== ")

    # Windows Git Bash 使用 Unix 路径格式
    build_cmd = f'export JAVA_HOME="{JAVA_HOME_UNIX}" && export PATH="$JAVA_HOME/bin:$PATH" && mvn clean package -DskipTests'

    success, output = run_local_command(build_cmd, cwd=LOCAL_PROJECT_ROOT)
    if not success:
        print("[失败] 后端构建失败")
        return False

    if not os.path.exists(LOCAL_API_JAR):
        print(f"[失败] JAR 文件不存在: {LOCAL_API_JAR}")
        return False

    print(f"[成功] 后端构建完成: {LOCAL_API_JAR}")
    return True


def build_frontend():
    """构建前端"""
    print("\n========== 构建前端 ========== ")

    web_dir = f"{LOCAL_PROJECT_ROOT}/gio-web"

    # 安装依赖
    success, _ = run_local_command("pnpm install", cwd=web_dir)
    if not success:
        print("[失败] 前端依赖安装失败")
        return False

    # 构建
    success, _ = run_local_command("pnpm build", cwd=web_dir)
    if not success:
        print("[失败] 前端构建失败")
        return False

    if not os.path.exists(LOCAL_WEB_DIST):
        print(f"[失败] 前端构建目录不存在: {LOCAL_WEB_DIST}")
        return False

    print(f"[成功] 前端构建完成: {LOCAL_WEB_DIST}")
    return True


def upload_files():
    """上传文件到服务器（使用 paramiko）"""
    print("\n========== 上传文件 ========== ")

    client = get_ssh_client()
    sftp = client.open_sftp()

    try:
        # 创建远程目录
        run_remote_command(client, f"mkdir -p {REMOTE_GIO_DIR}/logs {REMOTE_GIO_DIR}/uploads {REMOTE_STATIC_DIR}")

        # 上传 JAR 包
        print(f"[上传] JAR 包...")
        remote_jar_path = f"{REMOTE_GIO_DIR}/{REMOTE_JAR_NAME}"
        sftp.put(LOCAL_API_JAR, remote_jar_path)
        print("[成功] JAR 上传完成")

        # 清空远程 static 目录
        print("[清理] 清空旧前端文件...")
        run_remote_command(client, f"rm -rf {REMOTE_STATIC_DIR}/* && mkdir -p {REMOTE_STATIC_DIR}")

        # 递归上传前端文件
        print("[上传] 前端文件...")
        upload_directory(sftp, LOCAL_WEB_DIST, REMOTE_STATIC_DIR)
        print("[成功] 前端文件上传完成")

        return True

    except Exception as e:
        print(f"[失败] 上传失败: {e}")
        return False
    finally:
        sftp.close()
        client.close()


def upload_directory(sftp, local_dir, remote_dir):
    """递归上传目录"""
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"

        if os.path.isfile(local_path):
            print(f"  上传: {item}")
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            try:
                sftp.mkdir(remote_path)
            except:
                pass
            upload_directory(sftp, local_path, remote_path)


def deploy_remote():
    """远程部署：停止旧服务，启动新服务，重启 Nginx"""
    print("\n========== 远程部署 ========== ")

    client = get_ssh_client()

    try:
        # 停止旧 Java 进程
        print("[步骤] 停止旧后端进程...")
        run_remote_command(client, "pkill -f 'gio-api.*\\.jar' 2>/dev/null || true")
        time.sleep(2)

        # 停止 Python http.server（如果有）
        print("[步骤] 停止 Python http.server...")
        run_remote_command(client, "sudo pkill -f 'http.server' 2>/dev/null || true")
        time.sleep(1)

        # 启动后端服务
        print("[步骤] 启动后端服务...")
        start_cmd = f"cd {REMOTE_GIO_DIR} && nohup java -jar {REMOTE_JAR_NAME} --server.port={API_PORT} > logs/api.log 2>&1 &"
        run_remote_command(client, start_cmd)
        time.sleep(3)

        # 重启 Nginx（处理 HTTPS 和反向代理）
        print("[步骤] 重启 Nginx...")
        run_remote_command(client, "sudo systemctl restart nginx")
        time.sleep(2)

        # 检查进程状态
        print("[检查] 服务进程状态...")
        output, _ = run_remote_command(client, "ps aux | grep -E '(java.*gio|nginx)' | grep -v grep")
        print(output if output else "无进程")

        # 检查 Nginx 状态
        output, _ = run_remote_command(client, "sudo systemctl status nginx | head -5")
        print(output)

        print("[成功] 远程部署完成")
        return True

    except Exception as e:
        print(f"[失败] 远程部署失败: {e}")
        return False
    finally:
        client.close()


def verify_health():
    """健康验证（检查 HTTP/HTTPS/域名）"""
    print("\n========== 健康验证 ========== ")

    client = get_ssh_client()
    all_ok = True

    # 验证测试项
    tests = [
        ("HTTP IP (80)", f"curl -s -o /dev/null -w '%{{http_code}}' http://{SERVER_IP}", "301"),  # 应重定向到 HTTPS
        ("HTTPS IP", f"curl -sk -o /dev/null -w '%{{http_code}}' https://{SERVER_IP}", "200"),
        ("HTTPS 域名", f"curl -sk -o /dev/null -w '%{{http_code}}' https://{DOMAIN}", "200"),
        ("HTTPS API", f"curl -sk -o /dev/null -w '%{{http_code}}' https://{DOMAIN}/api/categories", "200"),
    ]

    try:
        for name, cmd, expected in tests:
            output, _ = run_remote_command(client, cmd)
            code = output.strip()
            status = "OK" if code == expected else "FAIL"
            print(f"[{status}] {name}: HTTP {code} (预期 {expected})")
            if code != expected:
                all_ok = False

        # 检查端口监听
        print("\n[验证] 端口监听状态...")
        output, _ = run_remote_command(client, "ss -tlnp | grep -E '(80|443|8081)'")
        print(output)

        # 检查 API 返回数据
        print("\n[验证] API 数据...")
        output, _ = run_remote_command(client, f"curl -sk https://{DOMAIN}/api/categories | head -c 200")
        print(output[:100] + "..." if len(output) > 100 else output)

        if all_ok:
            print("\n========== 部署成功 ========== ")
            print(f"官网: https://{DOMAIN}")
            print(f"官网 (IP): https://{SERVER_IP}")
            print(f"API: https://{DOMAIN}/api/...")
        else:
            print("\n========== 部署完成，但有警告 ========== ")
            # 查看后端日志
            print("\n=== 后端日志 ===")
            output, _ = run_remote_command(client, f"tail -30 {REMOTE_GIO_DIR}/logs/api.log")
            print(output)

        return all_ok

    except Exception as e:
        print(f"[失败] 验证失败: {e}")
        return False
    finally:
        client.close()


def full_deploy():
    """完整部署流程"""
    print("\n========== GIO 项目完整部署 ========== ")
    print(f"时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")

    steps = [
        ("构建后端", build_backend),
        ("构建前端", build_frontend),
        ("上传文件", upload_files),
        ("远程部署", deploy_remote),
        ("健康验证", verify_health),
    ]

    for name, func in steps:
        print(f"\n>>> 开始: {name}")
        if not func():
            print(f"\n[中断] {name} 失败，部署终止")
            return False

    print("\n========== 部署全部完成 ========== ")
    return True


def show_logs():
    """查看远程日志"""
    print("\n========== 查看日志 ========== ")

    client = get_ssh_client()
    try:
        print("=== 后端日志 (最近 50 行) ===")
        output, _ = run_remote_command(client, f"tail -50 {REMOTE_GIO_DIR}/logs/api.log")
        print(output)

        print("\n=== Nginx 状态 ===")
        output, _ = run_remote_command(client, "sudo systemctl status nginx | head -10")
        print(output)

    finally:
        client.close()


def restart_nginx():
    """单独重启 Nginx"""
    print("\n========== 重启 Nginx ========== ")

    client = get_ssh_client()
    try:
        run_remote_command(client, "sudo systemctl restart nginx")
        time.sleep(2)

        output, _ = run_remote_command(client, "sudo systemctl status nginx | head -5")
        print(output)

        output, _ = run_remote_command(client, "ss -tlnp | grep -E '(80|443)'")
        print("端口监听:", output)

        print("[成功] Nginx 重启完成")

    finally:
        client.close()


def main():
    parser = argparse.ArgumentParser(description="GIO 项目部署工具")
    parser.add_argument("--build", action="store_true", help="仅本地构建")
    parser.add_argument("--upload", action="store_true", help="仅上传文件")
    parser.add_argument("--deploy", action="store_true", help="仅远程部署")
    parser.add_argument("--verify", action="store_true", help="仅健康验证")
    parser.add_argument("--full", action="store_true", help="完整部署流程")
    parser.add_argument("--logs", action="store_true", help="查看远程日志")
    parser.add_argument("--nginx", action="store_true", help="单独重启 Nginx")

    args = parser.parse_args()

    if args.build:
        build_backend() and build_frontend()
    elif args.upload:
        upload_files()
    elif args.deploy:
        deploy_remote()
    elif args.verify:
        verify_health()
    elif args.logs:
        show_logs()
    elif args.nginx:
        restart_nginx()
    elif args.full:
        full_deploy()
    else:
        # 默认执行完整部署
        full_deploy()


if __name__ == "__main__":
    main()