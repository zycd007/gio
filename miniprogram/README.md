# GIO&SJ 微信小程序

GIO&SJ 设计事务所官方小程序 - 专注于个性化商业空间与私宅设计

## 项目结构

```
miniprogram/
├── app.js                 # 小程序逻辑
├── app.json               # 小程序配置
├── app.wxss               # 小程序样式（可选）
├── pages/
│   ├── index/            # 首页
│   │   ├── index.wxml
│   │   ├── index.js
│   │   └── index.wxss
│   ├── about/            # 关于页
│   │   ├── about.wxml
│   │   ├── about.js
│   │   └── about.wxss
│   ├── projects/         # 案例页
│   │   ├── projects.wxml
│   │   ├── projects.js
│   │   └── projects.wxss
│   └── contact/          # 联系页
│       ├── contact.wxml
│       ├── contact.js
│       └── contact.wxss
├── images/               # 图片资源
└── utils/                # 工具函数
```

## 快速开始

### 1. 准备工作

1. 注册微信小程序账号（https://mp.weixin.qq.com）
2. 获取 AppID
3. 下载微信开发者工具（https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html）

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 目录
4. 填入您的 AppID
5. 点击"导入"

### 3. 修改配置

编辑 `project.config.json`：
- 将 `appid` 替换为您的小程序 AppID

### 4. 编译运行

点击"编译"按钮即可预览小程序

## 功能模块

- **首页**: 品牌展示、核心优势、服务领域、业务覆盖
- **关于**: 公司介绍、设计理念
- **案例**: 10 个分类的作品展示
- **联系**: 联系方式、在线留言

## 自定义内容

### 修改联系方式

编辑 `pages/contact/contact.wxml` 修改：
- 公司地址
- 联系电话
- 电子邮箱
- 官方微信

### 添加案例项目

编辑 `pages/projects/projects.js` 中的 `projects` 数据

### 修改配色

全局配色在 `app.wxss` 或各页面 `.wxss` 文件中修改 CSS 变量

## 部署上线

1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 登录小程序后台提交审核
4. 审核通过后发布上线

## 技术栈

- 微信小程序原生开发
- WXML + WXSS + JavaScript

## 注意事项

1. 小程序需要配置合法的域名才能上线
2. web-view 组件需要在小程序后台配置业务域名
3. 图片资源建议放在 CDN 上
4. 提交前请确保所有功能测试通过

## 联系方式

- Email: contact@giosj.com
- WeChat: GIO-SJ

---

© 2024 GIO&SJ Design Studio. All rights reserved.
