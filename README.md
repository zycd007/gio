# GIO&SJ 设计公司官网项目

> The atmosphere creates the bottom of the mood

本项目是 GIO&SJ 设计事务所的官方网站，包含前后端完整实现。

## 项目结构

```
gio/
├── gio-api/              # 后端 Spring Boot 项目
│   ├── src/main/java/com/gio/
│   │   ├── controller/   # 控制器层
│   │   ├── service/      # 服务层
│   │   ├── mapper/       # 数据访问层
│   │   ├── entity/       # 实体类
│   │   ├── dto/          # 数据传输对象
│   │   ├── config/       # 配置类
│   │   └── common/       # 公共类
│   └── src/main/resources/
│       ├── application.yml  # 配置文件
│       └── db/schema.sql    # 数据库脚本
├── gio-web/              # 前端 React 项目
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── admin/        # 后台管理页面
│   │   ├── services/     # API 服务
│   │   └── utils/        # 工具函数
│   └── public/           # 静态资源
├── images_backup/        # 图片备份目录
└── uploads/              # 图片上传目录
```

## 技术栈

### 前端
- React 18 + TypeScript
- React Router v6
- Axios
- Tailwind CSS
- Vite

### 后端
- Java 17
- Spring Boot 3
- MyBatis-Plus
- Spring Security + JWT
- MySQL

## 快速开始

### 1. 初始化数据库

```bash
# 执行数据库脚本
mysql -u root -p < gio-api/src/main/resources/db/schema.sql
```

数据库配置：
- 地址：localhost:3306
- 数据库：gio_design
- 账号：root
- 密码：admin123

### 2. 启动后端

```bash
cd gio-api
mvn spring-boot:run
```

后端服务将在 http://localhost:8080 启动

### 3. 启动前端

```bash
cd gio-web
npm install
npm run dev
```

前端服务将在 http://localhost:5173 启动

## API 接口

### 公开接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/categories | GET | 获取分类列表 |
| /api/projects | GET | 获取项目列表（分页） |
| /api/projects/{id} | GET | 获取项目详情 |
| /api/images/{id} | GET | 获取图片 |

### 后台管理接口（需 JWT 认证）
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/admin/login | POST | 管理员登录 |
| /api/admin/categories | GET/POST/PUT/DELETE | 分类管理 |
| /api/admin/projects | GET/POST/PUT/DELETE | 项目管理 |
| /api/admin/projects/{id}/images | POST | 上传图片 |

## 后台管理

访问地址：http://localhost:5173/admin/login

默认账号：
- 用户名：admin
- 密码：admin123

## 功能特性

### 前台官网
- ✅ 响应式设计，适配 PC 和移动端
- ✅ 首页展示（Hero Banner、精选作品、关于我们）
- ✅ 案例作品列表（支持分类筛选）
- ✅ 项目详情页（图片预览）
- ✅ 关于页面
- ✅ 联系页面

### 后台管理
- ✅ 管理员登录（JWT 认证）
- ✅ 项目管理（增删改查）
- ✅ 分类管理
- ✅ 图片上传
- ✅ 封面图设置

## 图片说明

项目图片位于 `images_backup` 目录，共 16 个项目 73 张图片：

### 私宅空间（7 个）
- 麓湖、御府、现代风格私宅、新装饰主义、中州锦城、国际公寓、自然居所

### 餐饮空间（6 个）
- Date Bank、成都院子、Foooo、合景、浅喜、烟草博物馆

### 娱乐空间（1 个）
- TIC 娱乐

### 服装买手店（2 个）
- AFGK、FIL

## 部署上线

### 后端部署
1. 打包：`mvn clean package`
2. 上传 jar 包到服务器
3. 配置生产环境数据库
4. 运行：`java -jar gio-api-1.0.0.jar`

### 前端部署
1. 构建：`npm run build`
2. 将 dist 目录上传到 Nginx/Apache
3. 配置反向代理到后端 API

## 注意事项

1. 生产环境请修改 JWT secret
2. 图片上传目录需要设置读写权限
3. 建议使用对象存储（如阿里云 OSS）存储图片
4. 请修改默认管理员密码

---

© 2026 GIO&SJ Design Studio. All rights reserved.
