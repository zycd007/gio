#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查腾讯云服务器上 Claude Code 环境并帮助登录配置
"""
import paramiko
import time

SERVER = "140.143.87.54"
USER = "ubuntu"
PASSWORD = "@yuku007@"
SSH_TIMEOUT = 60

def exec_remote(client, command, timeout=30):
    """执行远程命令并返回输出"""
    print(f"\n>>> {command}")
    stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out:
        print(out)
    if err:
        print(f"ERROR: {err}")
    return out, err

def main():
    print("=" * 60)
    print("检查腾讯云服务器 Claude Code 环境")
    print("=" * 60)

    # 创建 SSH 连接
    print(f"\n连接服务器 {SERVER}...")
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
    print("SSH 连接成功!")

    try:
        # 1. 检查 tmux
        print("\n" + "=" * 60)
        print("步骤 1: 检查 tmux 是否安装")
        print("=" * 60)
        exec_remote(client, "which tmux && tmux -V")

        # 2. 检查 Claude Code CLI
        print("\n" + "=" * 60)
        print("步骤 2: 检查 Claude Code CLI")
        print("=" * 60)
        exec_remote(client, "which claude || echo 'claude not found'")
        exec_remote(client, "claude --version 2>&1 || true")

        # 3. 检查 oh-my-claudecode
        print("\n" + "=" * 60)
        print("步骤 3: 检查 oh-my-claudecode")
        print("=" * 60)
        exec_remote(client, "ls -la ~/.claude/ 2>/dev/null | head -20")
        exec_remote(client, "cat ~/.claude/settings.json 2>/dev/null | head -30")

        # 4. 检查 npm 全局包
        print("\n" + "=" * 60)
        print("步骤 4: 检查 npm 全局包")
        print("=" * 60)
        exec_remote(client, "npm list -g --depth=0 2>/dev/null | grep -i claude || echo 'No claude packages found'")

        # 5. 检查环境变量
        print("\n" + "=" * 60)
        print("步骤 5: 检查环境变量")
        print("=" * 60)
        exec_remote(client, "echo $PATH")
        exec_remote(client, "env | grep -i claude || echo 'No CLAUDE env vars'")
        exec_remote(client, "env | grep -i anthropic || echo 'No ANTHROPIC env vars'")

        # 6. 创建 tmux session 用于 Claude
        print("\n" + "=" * 60)
        print("步骤 6: 创建/检查 tmux claude session")
        print("=" * 60)
        exec_remote(client, "tmux has-session -t claude 2>/dev/null && echo 'Session exists' || (tmux new -d -s claude && echo 'Session created')")
        exec_remote(client, "tmux list-sessions")

        print("\n" + "=" * 60)
        print("检查完成!")
        print("=" * 60)
        print("""
下一步操作:

1. SSH 登录服务器:
   ssh ubuntu@140.143.87.54

2. 连接到 tmux session:
   tmux attach -t claude

3. 在 tmux 中执行 /login 完成 Claude 登录:
   /login

4. 或者在 tmux 中直接启动 claude:
   claude
""")

    finally:
        client.close()

if __name__ == "__main__":
    main()
