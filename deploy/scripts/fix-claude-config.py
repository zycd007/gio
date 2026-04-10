#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复腾讯云服务器 Claude Code 配置并添加 .claude.json
"""
import paramiko
import json
import time

SERVER = "140.143.87.54"
USER = "ubuntu"
PASSWORD = "@yuku007@"
SSH_TIMEOUT = 60

def main():
    print("=" * 60)
    print("修复腾讯云服务器 Claude Code 配置")
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
        # 步骤 1: 更新 settings.json
        print("\n" + "=" * 60)
        print("步骤 1: 更新 settings.json (模型改为 MiniMax-M2.7)")
        print("=" * 60)

        # 使用 echo 和 sed 更新配置
        new_settings = '{\n  "apiKey": "sk-cp-BQt1g7saDmYVAGXSuCvuXty8KRlufsc4jWYpBKZAZo1A13gmWEJb7ZtpnjMNV6HpjjRf8vXLHigDZp53hCLBPugx0R7-elRpLQ8KTLRFCJBJIQQFWw6D4j4",\n  "baseUrl": "https://api.minimaxi.com/anthropic",\n  "model": "MiniMax-M2.7"\n}'

        # 写入 settings.json
        stdin, stdout, stderr = client.exec_command("cat > /home/ubuntu/.claude/settings.json", timeout=30)
        stdin.write(new_settings)
        stdin.close()
        print("settings.json 已更新")

        # 验证
        stdin, stdout, stderr = client.exec_command("cat /home/ubuntu/.claude/settings.json", timeout=30)
        print(f"当前 settings.json:\n{stdout.read().decode('utf-8')}")

        # 步骤 2: 创建 .claude.json 添加 hasCompletedOnboarding
        print("\n" + "=" * 60)
        print("步骤 2: 创建 .claude.json")
        print("=" * 60)

        new_claude_json = '{\n  "hasCompletedOnboarding": true\n}'

        stdin, stdout, stderr = client.exec_command("cat > /home/ubuntu/.claude.json", timeout=30)
        stdin.write(new_claude_json)
        stdin.close()
        print(".claude.json 已创建")

        # 验证
        stdin, stdout, stderr = client.exec_command("cat /home/ubuntu/.claude.json", timeout=30)
        print(f"当前 .claude.json:\n{stdout.read().decode('utf-8')}")

        # 步骤 3: 设置权限
        print("\n" + "=" * 60)
        print("步骤 3: 设置文件权限")
        print("=" * 60)

        stdin, stdout, stderr = client.exec_command(
            "chmod 600 /home/ubuntu/.claude/settings.json /home/ubuntu/.claude.json && " +
            "chown ubuntu:ubuntu /home/ubuntu/.claude/settings.json /home/ubuntu/.claude.json && " +
            "ls -la /home/ubuntu/.claude*", timeout=30)
        print(stdout.read().decode('utf-8'))

        # 步骤 4: 测试 claude 命令
        print("\n" + "=" * 60)
        print("步骤 4: 在 tmux 中测试 claude")
        print("=" * 60)

        # 发送命令到 tmux
        client.exec_command("tmux send-keys -t claude 'echo 配置已更新' Enter", timeout=10)
        time.sleep(0.5)

        # 获取 tmux 输出
        stdin, stdout, stderr = client.exec_command("tmux capture-pane -t claude -p", timeout=10)
        print(f"tmux 输出:\n{stdout.read().decode('utf-8')}")

        print("\n" + "=" * 60)
        print("配置修复完成!")
        print("=" * 60)
        print("""
已完成:
1. settings.json - 模型已改为 MiniMax-M2.7
2. .claude.json - 添加 hasCompletedOnboarding: true
3. 文件权限已设置

下一步操作:
1. SSH 登录服务器: ssh ubuntu@140.143.87.54
2. 连接 tmux: tmux attach -t claude
3. 在 tmux 中使用 claude
""")

    finally:
        client.close()

if __name__ == "__main__":
    main()
