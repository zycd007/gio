# GIO 设计事务所测试用例文档

## 测试概览

本文档描述 GIO 设计事务所项目的完整测试用例，涵盖：
- 单元测试（Service 层）
- 集成测试（Controller 层）
- 端到端测试（前后端交互）

## 目录结构

```
test-cases/
├── README.md                         # 本文档
├── unit/                             # 单元测试
│   ├── service/
│   │   ├── AdminServiceTest.java     # 管理员服务测试 (7 tests)
│   │   ├── ProjectServiceTest.java  # 项目服务测试 (12 tests)
│   │   ├── CategoryServiceTest.java # 分类服务测试 (5 tests)
│   │   └── ImageServiceTest.java    # 图片服务测试 (10 tests)
│   └── common/
│       └── ResultTest.java          # 统一返回结果测试 (6 tests)
├── integration/                      # 集成测试
│   ├── controller/
│   │   ├── PortalControllerTest.java          # C端门户接口测试 (7 tests)
│   │   ├── AdminLoginControllerTest.java      # 管理员登录测试 (8 tests)
│   │   ├── AdminProjectControllerTest.java    # 项目管理接口测试 (12 tests)
│   │   ├── AdminCategoryControllerTest.java   # 分类管理接口测试 (11 tests)
│   │   └── AdminImageControllerTest.java      # 图片管理接口测试 (6 tests)
│   └── security/
│       └── JwtAuthenticationTest.java # JWT认证安全测试 (9 tests)
└── e2e/                              # 端到端测试
    ├── AuthenticationFlowTest.java          # 认证流程测试 (8 tests)
    ├── ProjectManagementFlowTest.java       # 项目管理流程测试 (13 tests)
    └── CategoryManagementFlowTest.java      # 分类管理流程测试 (12 tests)
```

## 测试用例统计

| 测试类型 | 测试类数量 | 测试方法数量 |
|----------|-----------|--------------|
| 单元测试 | 5 | 40 |
| 集成测试 | 7 | 53 |
| E2E测试 | 3 | 33 |
| **总计** | **15** | **126** |

## 核心测试场景覆盖

### 1. 认证模块 (Authentication)
- [x] 正确账号密码登录
- [x] 错误密码登录
- [x] 不存在账号登录
- [x] 禁用账号登录
- [x] 空请求体登录
- [x] JWT Token 生成与验证
- [x] Token 过期处理
- [x] 刷新 Token

### 2. 分类模块 (Categories)
- [x] 获取启用的分类列表（C端）
- [x] 获取所有分类（管理端）
- [x] 创建分类（成功/失败场景）
- [x] 更新分类
- [x] 删除分类
- [x] 分类启用/禁用

### 3. 项目模块 (Projects)
- [x] 获取项目列表（分页）
- [x] 获取项目列表（分类筛选）
- [x] 获取项目详情
- [x] 创建项目
- [x] 更新项目
- [x] 删除项目
- [x] 项目发布/下架
- [x] 浏览量递增
- [x] 分类下项目查询

### 4. 图片模块 (Images)
- [x] 上传图片
- [x] 删除图片
- [x] 获取项目图片列表
- [x] 设置封面图

### 5. 安全模块 (Security)
- [x] Token 生成
- [x] Token 验证
- [x] Token 解析
- [x] Token 过期检查
- [x] 未授权访问拦截

## 测试运行

```bash
# 运行所有测试
mvn test

# 运行单元测试
mvn test -Dtest="**/unit/**/*Test"

# 运行集成测试
mvn test -Dtest="**/integration/**/*Test"

# 运行特定测试类
mvn test -Dtest=AdminServiceTest

# 生成测试覆盖率报告
mvn test -Dcoverage
```

## 测试环境配置

### 数据库配置（测试环境）
- 主机: localhost
- 端口: 3306
- 数据库: gio_design_test
- 字符集: utf8mb4

### JWT 测试配置
- 密钥: test-jwt-secret-key-for-testing-only
- 过期时间: 86400000ms (24小时)

## 默认测试数据

### 管理员账户
| 账号 | 密码 | 状态 |
|------|------|------|
| admin | admin123 | 启用 |
| test | test123 | 启用 |
| disabled | disabled123 | 禁用 |

### 预置分类
- 住宅空间 (residential)
- 餐饮空间 (restaurant)
- 办公空间 (office)

## 核心测试场景

### 1. 认证测试
- [x] 正确账号密码登录
- [x] 错误密码登录
- [x] 不存在账号登录
- [x] 禁用账号登录
- [x] JWT Token 验证
- [x] Token 过期处理

### 2. 分类管理测试
- [x] 获取启用的分类列表（C端）
- [x] 获取所有分类（管理端）
- [x] 创建分类
- [x] 更新分类
- [x] 删除分类

### 3. 项目管理测试
- [x] 获取项目列表（分页）
- [x] 获取项目详情
- [x] 创建项目
- [x] 更新项目
- [x] 删除项目
- [x] 浏览量递增
- [x] 项目发布/下架

### 4. 图片管理测试
- [x] 上传图片
- [x] 删除图片
- [x] 获取项目图片列表

### 5. 数据统计测试
- [x] Dashboard 统计数据获取

## 测试覆盖率目标

| 模块 | 目标覆盖率 |
|------|-----------|
| Service 层 | 80%+ |
| Controller 层 | 70%+ |
| 整体 | 70%+ |

## 注意事项

1. 测试数据使用后需要清理
2. 集成测试需要启动完整 Spring 上下文
3. 文件上传测试使用 MockMultipartFile
4. JWT 测试需要设置正确的测试配置