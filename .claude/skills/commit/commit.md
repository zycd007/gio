# commit

提交代码到 GitHub。

## 使用方式

```
/commit
```

## 功能说明

执行以下步骤完成代码提交：

1. **检查状态** - 查看 git status 和 git diff
2. **暂存文件** - 添加有变动的文件到暂存区
3. **生成提交信息** - 根据变更内容生成符合规范的提交信息
4. **执行提交** - 创建 git commit
5. **推送到远程** - 推送到 GitHub 远程仓库

## 提交规范

遵循项目 Git 提交规范：

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat: add user login feature` |
| fix | Bug 修复 | `fix: resolve null pointer exception` |
| refactor | 重构 | `refactor: simplify auth middleware` |
| docs | 文档更新 | `docs: update API description` |
| style | 代码格式 | `style: format code indentation` |
| test | 测试 | `test: add unit test for service` |
| chore | 构建/配置 | `chore: update dependencies` |
| perf | 性能优化 | `perf: improve query efficiency` |
| merge | 合并分支 | `merge: feature-branch into main` |
| revert | 回滚 | `revert: undo last commit` |

## 提交信息格式

```
<type>: <subject>

[optional body]
```

- **type**: 提交类型（见上表）
- **subject**: 简短描述（50 字符内，小写开头，无句号）
- **body**: 详细描述（可选，说明为什么做这个改动）

## 示例

```bash
# 单行提交
git commit -m "feat: add message management"

# 带详细描述的提交
git commit -m "feat: add message management

- Add message list page
- Add message create/edit form
- Add message delete confirmation"
```

## 注意事项

- 提交前确保代码已通过编译和测试
- 敏感文件（.env、密码等）不要提交
- 遵循项目的代码规范和提交规范
