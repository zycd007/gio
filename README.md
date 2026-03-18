# GIO&SJ 设计公司官网项目

> The atmosphere creates the bottom of the mood

本项目包含两个版本的公司介绍官网，专为微信小程序展示设计：

## 项目结构

```
gio/
├── index.html              # H5 版本（可直接在微信 web-view 中运行）
├── README.md               # 项目说明
└── miniprogram/            # 微信小程序原生版本
    ├── app.js              # 小程序入口
    ├── app.json            # 小程序配置
    ├── app.wxss            # 全局样式
    ├── project.config.json # 项目配置
    ├── pages/              # 页面目录
    │   ├── index/          # 首页
    │   ├── about/          # 关于页
    │   ├── projects/       # 案例页
    │   ├── project-detail/ # 项目详情页
    │   └── contact/        # 联系页
    ├── components/         # 组件目录
    │   └── tabbar/         # 自定义底部导航
    └── images/             # 图片资源
```

---

## 版本一：H5 版本 (index.html)

### 特点
- 单文件 HTML，开箱即用
- 响应式设计，完美适配移动端
- 可在微信 web-view 组件中直接使用
- 现代简约的设计风格

### 使用方法

1. **本地预览**
   ```bash
   # 直接用浏览器打开 index.html
   ```

2. **部署到服务器**
   - 将 `index.html` 上传到您的 Web 服务器
   - 确保使用 HTTPS 协议（微信小程序要求）

3. **在微信小程序中使用**
   - 在小程序后台配置业务域名
   - 在小程序中使用 `<web-view>` 组件：
   ```xml
   <web-view src="https://yourdomain.com/index.html"></web-view>
   ```

### 功能模块
- ✅ 品牌展示（Hero Section）
- ✅ 公司介绍
- ✅ 核心优势展示
- ✅ 服务领域
- ✅ 业务覆盖城市
- ✅ 案例分类展示（10 个分类）
- ✅ 项目列表
- ✅ 联系方式
- ✅ 在线留言表单

---

## 版本二：微信小程序原生版本 (miniprogram/)

### 特点
- 原生微信小程序开发
- 更流畅的用户体验
- 可直接发布为独立小程序
- 支持更多小程序特性

### 快速开始

#### 1. 准备工作
- 注册微信小程序账号：https://mp.weixin.qq.com
- 获取 AppID
- 下载微信开发者工具

#### 2. 导入项目
1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 目录
4. 填入您的 AppID
5. 点击"导入"

#### 3. 修改配置
编辑 `project.config.json`，将 `appid` 替换为您的小程序 AppID

#### 4. 编译运行
点击"编译"按钮即可预览

### 页面说明

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | /pages/index/index | 品牌展示、核心优势、服务领域 |
| 关于 | /pages/about/about | 公司介绍、设计理念 |
| 案例 | /pages/projects/projects | 案例分类、项目列表 |
| 联系 | /pages/contact/contact | 联系方式、在线留言 |

### 自定义内容

#### 修改联系方式
编辑 `pages/contact/contact.wxml`

#### 添加案例项目
编辑 `pages/projects/projects.js` 中的 `projects` 数据

#### 修改配色
编辑 `app.wxss` 中的 CSS 变量

---

## 设计说明

### 配色方案
```css
--primary: #1a1a1a;    /* 主色调 - 深灰黑 */
--secondary: #666666;  /* 辅助色 - 中灰 */
--accent: #c9a962;     /* 强调色 - 金色 */
--bg: #f8f8f8;         /* 背景色 - 浅灰 */
--white: #ffffff;      /* 白色 */
```

### 字体
- 中文：PingFang SC, Microsoft YaHei
- 英文：-apple-system, BlinkMacSystemFont, Segoe UI

### 设计理念
- 简约高端
- 黑白金经典配色
- 突出设计作品
- 移动端优先

---

## 公司信息（根据 PPT 整理）

### 关于 GIO&SJ
- 成立时间：2024 年
- 团队定位：90 后设计团队
- 专注领域：个性化商业空间、私宅设计
- 服务理念：设计 + 施工 + 软装一体化

### 核心优势
- 原创设计
- 精细施工
- 全案软装
- 工厂直供
- 严选产品
- 私宅定制

### 服务领域
餐饮空间、酒吧俱乐部、娱乐空间、办公空间、酒店民宿、服装买手店、婚纱摄影、医美空间、展厅展览、私宅设计

### 业务覆盖
成都、上海、南京、武汉、西安、长沙、广州、佛山、银川、重庆等

---

## 技术栈

### H5 版本
- HTML5
- CSS3
- Vanilla JavaScript

### 小程序版本
- 微信小程序原生开发
- WXML + WXSS + JavaScript

---

## 部署上线

### H5 版本
1. 购买域名和服务器
2. 配置 HTTPS
3. 上传 `index.html`
4. 在小程序后台配置业务域名

### 小程序版本
1. 在微信开发者工具中点击"上传"
2. 填写版本号和备注
3. 登录小程序后台提交审核
4. 审核通过后发布

---

## 注意事项

1. **域名备案**：小程序要求域名必须备案
2. **HTTPS**：必须使用 HTTPS 协议
3. **业务域名配置**：在小程序后台提前配置
4. **图片资源**：建议使用 CDN 加速
5. **隐私协议**：上线前需配置用户隐私协议

---

## 后续优化建议

1. 添加真实项目图片
2. 集成微信登录
3. 添加在线客服功能
4. 接入地图导航
5. 添加预约功能
6. 数据统计接入（微信小程序统计）

---

## 联系方式

- Email: contact@giosj.com
- WeChat: GIO-SJ

---

© 2024 GIO&SJ Design Studio. All rights reserved.
