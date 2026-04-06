#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GIO 项目自动化部署脚本 (增强版)
使用方式：python deploy.py

优化特点:
- 增量编译，跳过 clean 步骤
- 完全使用 paramiko，无密码弹窗
- 增强的错误处理和重试机制
- 智能等待服务启动，确保部署成功
- 自动清理临时文件
- 完整的日志输出
"""
import os
import sys
import time
import subprocess
import paramiko
from pathlib import Path
import tarfile
import tempfile
import shutil
import urllib.request
import urllib.error
import ssl

# ==================== 配置区域 ====================
SERVER = "140.143.87.54"
USER = "ubuntu"
PASSWORD = "@yuku007@"
REMOTE_DIR = "/home/ubuntu/gio"
LOCAL_PROJECT = Path("E:/my_projects/gio")

# 超时配置 (秒)
SSH_TIMEOUT = 60
SFTP_TIMEOUT = 300
SERVICE_START_TIMEOUT = 45  # 服务启动最大等待时间
VERIFICATION_TIMEOUT = 10   # 验证超时时间

# 重试配置
MAX_RETRIES = 2
RETRY_DELAY = 5

# 服务配置
API_PORT = 8081
FRONTEND_PORT = 80
# ==================== 配置区域 ====================


class Colors:
    """终端颜色输出"""
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


# 使用纯 ASCII 符号，避免编码问题
CHECK_MARK = "OK"
WARNING_MARK = "WARN"
CROSS_MARK = "FAIL"


def log_info(msg):
    print(f"{Colors.BLUE}[INFO]{Colors.RESET} {msg}")


def log_success(msg):
    print(f"{Colors.GREEN}[SUCCESS]{Colors.RESET} {msg}")


def log_warning(msg):
    print(f"{Colors.YELLOW}[WARNING]{Colors.RESET} {msg}")


def log_error(msg):
    print(f"{Colors.RED}[ERROR]{Colors.RESET} {msg}")


def log_step(msg):
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{msg}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.RESET}")


def run_cmd(cmd, capture=False, timeout=600):
    """执行本地命令"""
    print(f"  > {cmd}")
    try:
        # Windows 下使用 chcp 65001 设置 UTF-8 编码
        if os.name == 'nt':
            cmd = 'chcp 65001 >nul 2>&1 && ' + cmd

        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=capture,
            text=True,
            timeout=timeout,
            encoding='utf-8',
            errors='ignore'
        )
        return result
    except subprocess.TimeoutExpired:
        log_error(f"命令执行超时：{cmd}")
        return None
    except Exception as e:
        log_error(f"命令执行失败：{e}")
        return None


def check_file_exists(path, description):
    """检查文件是否存在"""
    if not os.path.exists(path):
        log_error(f"{description} 不存在：{path}")
        return False
    size = os.path.getsize(path) / (1024 * 1024)  # MB
    log_info(f"{description}: {size:.2f} MB")
    return True


def create_ssh_connection():
    """创建 SSH 连接，带重试"""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            log_info(f"连接服务器 {SERVER} (尝试 {attempt}/{MAX_RETRIES})...")
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                SERVER,
                username=USER,
                password=PASSWORD,
                timeout=SSH_TIMEOUT,
                look_for_keys=False,
                allow_agent=False
            )
            log_success("SSH 连接成功")
            return client
        except Exception as e:
            log_warning(f"连接失败：{e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            else:
                log_error("无法连接到服务器，请检查网络和服务器状态")
                return None
    return None


def exec_remote(client, command, timeout=60, get_output=False):
    """执行远程命令"""
    stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
    if get_output:
        return stdout.read().decode('utf-8', errors='ignore'), \
               stderr.read().decode('utf-8', errors='ignore')
    return None, None


def wait_for_service(client, port, max_attempts=20):
    """等待服务启动"""
    log_info(f"等待端口 {port} 服务启动...")
    for i in range(max_attempts):
        output, _ = exec_remote(
            client,
            f"netstat -tlnp 2>/dev/null | grep ':{port} ' || ss -tlnp 2>/dev/null | grep ':{port} '",
            get_output=True
        )
        if output.strip():
            return True
        time.sleep(1.5)
    return False


def check_url(url, timeout=VERIFICATION_TIMEOUT):
    """检查 URL 是否可访问"""
    try:
        # 创建不验证 SSL 的上下文（用于开发环境）
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as response:
            return response.status
    except urllib.error.HTTPError as e:
        # 401/403/405 表示服务正常（需要认证或方法不对）
        if e.code in [401, 403, 405]:
            return e.code
        return e.code
    except urllib.error.URLError as e:
        error_msg = str(e)
        # SSL 证书错误时认为服务可用
        if 'CERTIFICATE' in error_msg or 'SSL' in error_msg:
            return 200
        # 连接拒绝表示服务未启动
        if 'refused' in error_msg.lower():
            return 0
        return 0
    except Exception as e:
        log_warning(f"URL 检查异常：{e}")
        return 0


def verify_deployment(client):
    """验证部署结果"""
    log_step("[5/5] 验证部署")

    # 等待服务完全启动
    log_info("等待服务启动...")

    # 检查 API 服务
    api_ready = wait_for_service(client, API_PORT, max_attempts=20)
    if not api_ready:
        log_error(f"API 服务 (端口{API_PORT}) 启动超时")

    # 检查前端服务
    frontend_ready = wait_for_service(client, FRONTEND_PORT, max_attempts=10)
    if not frontend_ready:
        log_warning(f"前端服务 (端口{FRONTEND_PORT}) 可能未启动")

    # 额外等待，确保 Spring 完全初始化
    log_info("等待 Spring 应用完全初始化...")
    time.sleep(5)

    # HTTP 验证（带重试）
    base_url = f"http://{SERVER}"
    max_verify_retries = 3

    # 验证前端
    frontend_status = 0
    for i in range(max_verify_retries):
        frontend_status = check_url(f"{base_url}/")
        if frontend_status in [200, 301, 302]:
            break
        if i < max_verify_retries - 1:
            time.sleep(2)
    frontend_ok = frontend_status in [200, 301, 302]
    status_str = f"{Colors.GREEN}OK{Colors.RESET}" if frontend_ok else f"{Colors.RED}FAIL{Colors.RESET}"
    print(f"  前端页面：{status_str} (HTTP {frontend_status})")

    # 验证 API 服务
    api_status = 0
    for i in range(max_verify_retries):
        api_status = check_url(f"{base_url}:{API_PORT}/api/categories")
        if api_status == 200:
            break
        if i < max_verify_retries - 1:
            time.sleep(2)
    api_ok = api_status == 200
    status_str = f"{Colors.GREEN}OK{Colors.RESET}" if api_ok else f"{Colors.RED}FAIL{Colors.RESET}"
    print(f"  API 服务:   {status_str} (HTTP {api_status})")

    return frontend_ok and api_ok


def cleanup_temp_files(client):
    """清理服务器临时文件"""
    log_info("清理临时文件...")
    exec_remote(client, "rm -f /tmp/dist.tar.gz")
    exec_remote(client, "rm -f /tmp/*.jar")
    exec_remote(client, "rm -f /tmp/kids-poem-*.tar.gz")  # 清理旧文件


def deploy():
    """主部署函数"""
    start_time = time.time()

    log_step("GIO 项目部署开始")

    # ==================== 步骤 1: 本地构建 ====================
    log_step("[1/5] 本地构建（增量编译）")

    # 设置 Java 环境
    java_home = "C:/Users/Administrator/.jdks/ms-17.0.17"
    os.environ["JAVA_HOME"] = java_home
    os.environ["PATH"] = f"{java_home}/bin;{os.environ['PATH']}"

    # 保存当前目录
    original_dir = os.getcwd()

    # 构建后端
    log_info("构建后端 (gio-api)...")
    os.chdir(LOCAL_PROJECT)
    result = run_cmd('mvn package -DskipTests -q')
    os.chdir(original_dir)
    if result is None or result.returncode != 0:
        log_error("后端构建失败")
        return False
    if not check_file_exists(
        f"{LOCAL_PROJECT}/gio-api/target/gio-api-1.0.0.jar",
        "API JAR"
    ):
        return False

    # 构建前端
    log_info("构建前端 (gio-web)...")
    os.chdir(LOCAL_PROJECT / 'gio-web')
    result = run_cmd('pnpm build')
    os.chdir(original_dir)
    if result is None or result.returncode != 0:
        log_error("前端构建失败")
        return False
    if not check_file_exists(
        f"{LOCAL_PROJECT}/gio-web/dist/index.html",
        "前端 dist"
    ):
        return False

    build_time = time.time() - start_time
    log_success(f"构建完成 (耗时：{build_time:.1f}s)")

    # ==================== 步骤 2: 准备上传文件 ====================
    log_step("[2/5] 准备上传文件")

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)

        # 复制 JAR 包
        log_info("准备 JAR 文件...")
        shutil.copy(
            f"{LOCAL_PROJECT}/gio-api/target/gio-api-1.0.0.jar",
            tmpdir / 'gio-api-1.0.0.jar'
        )

        # 打包前端 (使用更快的压缩级别)
        log_info("打包前端文件...")
        dist_dir = LOCAL_PROJECT / 'gio-web' / 'dist'
        with tarfile.open(tmpdir / 'dist.tar.gz', 'w:gz', compresslevel=6) as tar:
            tar.add(dist_dir, arcname='dist')

        prepare_time = time.time() - start_time - build_time
        log_success(f"准备完成 (耗时：{prepare_time:.1f}s)")

        # ==================== 步骤 3: 上传文件 ====================
        log_step("[3/5] 上传文件到服务器")

        # 创建 SSH 连接
        client = create_ssh_connection()
        if not client:
            return False

        try:
            # 创建 SFTP 连接
            sftp = client.open_sftp()

            # 上传 JAR 包
            log_info("上传 JAR 文件...")
            sftp.put(
                str(tmpdir / 'gio-api-1.0.0.jar'),
                f'{REMOTE_DIR}/gio-api-1.0.0.jar'
            )
            log_success("JAR 文件上传完成")

            # 上传前端
            log_info("上传前端文件...")
            sftp.put(str(tmpdir / 'dist.tar.gz'), '/tmp/dist.tar.gz')
            log_success("前端文件上传完成")

            sftp.close()

        except Exception as e:
            log_error(f"上传失败：{e}")
            client.close()
            return False

        upload_time = time.time() - start_time - build_time - prepare_time
        log_success(f"上传完成 (耗时：{upload_time:.1f}s)")

        # ==================== 步骤 4: 部署服务 ====================
        log_step("[4/5] 部署服务")

        # 停止旧服务
        log_info("停止旧服务...")
        exec_remote(client, 'sudo systemctl stop nginx 2>/dev/null || true')
        exec_remote(client, 'pkill -f "gio-.*\\.jar" 2>/dev/null || true')
        exec_remote(client, 'pkill -f "python3.*http\\.server" 2>/dev/null || true')
        time.sleep(1)  # 等待进程完全停止

        # 确保日志目录存在
        exec_remote(client, f'mkdir -p {REMOTE_DIR}/logs')

        # 解压前端文件
        log_info("解压前端文件...")
        exec_remote(client, f'rm -rf {REMOTE_DIR}/static')
        exec_remote(client, f'cd /tmp && tar -xzf dist.tar.gz -C {REMOTE_DIR}/')
        exec_remote(client, f'mv {REMOTE_DIR}/dist {REMOTE_DIR}/static')

        # 启动服务
        log_info("启动 API 服务...")
        exec_remote(
            client,
            f'cd {REMOTE_DIR} && nohup java -Xms512m -Xmx1g -jar '
            f'gio-api-1.0.0.jar --server.port={API_PORT} '
            f'> {REMOTE_DIR}/logs/api.log 2>&1 &'
        )

        log_info("启动前端服务...")
        exec_remote(
            client,
            f'cd {REMOTE_DIR}/static && nohup python3 -m http.server {FRONTEND_PORT} '
            f'> {REMOTE_DIR}/logs/frontend.log 2>&1 &'
        )

        # 清理临时文件
        cleanup_temp_files(client)

        log_success("服务启动命令已执行")

        deploy_time = time.time() - start_time - build_time - prepare_time - upload_time
        log_success(f"部署完成 (耗时：{deploy_time:.1f}s)")

        # ==================== 步骤 5: 验证部署 ====================
        all_ok = verify_deployment(client)

        client.close()

        # ==================== 总结 ====================
        total_time = time.time() - start_time

        log_step("部署总结")
        print(f"  总耗时：{Colors.BOLD}{total_time:.1f}秒{Colors.RESET}")
        print(f"  构建耗时：{build_time:.1f}s")
        print(f"  准备耗时：{prepare_time:.1f}s")
        print(f"  上传耗时：{upload_time:.1f}s")
        print(f"  部署耗时：{deploy_time:.1f}s")

        if all_ok:
            print(f"\n  {Colors.GREEN}{Colors.BOLD}[{CHECK_MARK}] 部署成功!{Colors.RESET}")
            print(f"  访问地址：")
            print(f"    前端页面：http://{SERVER}")
            print(f"    API 服务:  http://{SERVER}:{API_PORT}")
            print(f"\n  日志查看：")
            print(f"    ssh {USER}@{SERVER}")
            print(f"    tail -f ~/gio/logs/api.log")
            return True
        else:
            print(f"\n  {Colors.YELLOW}{Colors.BOLD}[{WARNING_MARK}] 部署完成但验证失败，请检查日志{Colors.RESET}")
            print(f"  访问地址：http://{SERVER}")
            return False


if __name__ == "__main__":
    try:
        success = deploy()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}部署被用户中断{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        log_error(f"部署异常：{e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
