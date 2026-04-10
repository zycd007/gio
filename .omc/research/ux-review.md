# GIO 项目 UX 审查报告

## 审查范围
- 前台页面：C端官网首页、项目列表页、项目详情页
- 后台管理页面：Layout、Dashboard、Categories、Messages、Projects、ProjectDetailPage、Copywriting

---

## 一、严重问题（需立即修复）

### 1.1 后台 - 留言状态统计数据错误
**文件**: `gio-web/src/admin/Dashboard.tsx` (第28-38行)

```javascript
getMessages(1, 1, 0) // 获取未处理留言
.then(([dashboardData, messagesData]) => {
  setStats({
    // ...
    totalMessages: messagesData.total || 0,
    pendingMessages: messagesData.total || 0, // 两个字段用同一个值！
  });
```

**问题**: `totalMessages` 和 `pendingMessages` 都使用了未处理留言的数量，忽略了已处理留言。正确做法是分别调用获取总数和未处理数，或在接口中返回两个值。

**建议修复**:
```javascript
Promise.all([
  getDashboardStats(),
  getMessages(1, 1, 0),  // 未处理
  getMessages(1, 1, undefined)  // 全部
])
```

### 1.2 后台 - 图片查看器强制黑色背景无关闭按钮
**文件**: `gio-web/src/pages/ProjectDetail.tsx` (第138行)

```javascript
<div className="fixed inset-0 z-50 flex items-center justify-center"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
```

**问题**: 图片查看器打开时背景是纯黑，关闭按钮使用 `color: '#fff'`，在某些显示器上对比度不足。点击图片背景无法关闭（只有点击关闭按钮或按 ESC 才能关闭），与常见的图片查看器交互不一致。

**建议**: 点击图片区域也应该能关闭查看器。

### 1.3 后台 - 分页输入框存在默认值不同步问题
**文件**: `gio-web/src/admin/Copywriting.tsx` (第313-328行)

```javascript
<input
  type="number"
  min="1"
  max={Math.ceil(pagination.total / pagination.size)}
  defaultValue={pagination.page}  // 使用 defaultValue 而非 value
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
```

**问题**: 使用 `defaultValue` 而非 `value`，导致用户在输入框中输入页码后，如果没按 Enter 就切换到其他操作，输入的值不会被使用。同时也无法实时显示当前页码的变化。

---

## 二、重要问题

### 2.1 后台 - 侧边栏折叠后 tooltip 缺失
**文件**: `gio-web/src/admin/Layout.tsx` (第198行)

```javascript
title={collapsed ? String(children) : undefined}
```

**问题**: 折叠后导航项的 `title` 属性设为 `undefined`，导致用户无法通过悬停看到完整菜单名。Tooltip 没有显示。

**建议**: 始终保留 `title` 属性，或使用 `aria-label`。

### 2.2 前台 - 分类过滤没有"重置"按钮
**文件**: `gio-web/src/pages/Projects.tsx` (第112-140行)

**问题**: 选中某个分类后，只能通过点击"全部"来取消筛选，缺少一个明确的"清除筛选"或"X"按钮。用户不知道当前是否有筛选生效。

**建议**: 在选中分类后显示一个重置/清除按钮。

### 2.3 后台 - 留言列表可优化项
**文件**: `gio-web/src/admin/Messages.tsx` (第180行)

```javascript
<td className="px-6 py-4 text-slate-600 max-w-xs truncate">
  {message.content}
```

**问题**: 留言内容使用 `truncate`，但留言可能有多行重要内容，单行截断会导致信息丢失。

**建议**: 考虑在列表中显示前50-100字符，而非单行截断；或通过点击"查看"查看完整内容。

### 2.4 后台 - 推文管理搜索无防抖
**文件**: `gio-web/src/admin/Copywriting.tsx` (第114-117行)

```javascript
onChange={(e) => {
  setSearchKeyword(e.target.value);
  setPagination(prev => ({ ...prev, page: 1 }));
}}
```

**问题**: 搜索框输入时立即触发 API 请求，没有防抖处理，可能导致频繁请求。

**建议**: 增加 300ms 防抖。

### 2.5 后台 - 项目管理批量操作后复选框状态未保留
**文件**: `gio-web/src/admin/Projects.tsx` (第155行)

```javascript
setSelectedIds(new Set()); // 刷新时清空选择
```

**问题**: 批量上架/下架/删除操作后，选择状态被清空。如果用户需要连续执行多个批量操作，必须重新选择，体验不佳。

**建议**: 批量操作成功后保留已选中的项目ID（在列表中仍存在的那些）。

---

## 三、一般问题

### 3.1 后台 - Dashboard 快捷操作链接不够精准
**文件**: `gio-web/src/admin/Dashboard.tsx` (第140-168行)

**问题**: "新建项目"和"管理项目"两个快捷入口都链接到 `/admin/projects`，用户点击"新建项目"时实际上无法直接新建（需要在该页面找按钮）。

**建议**: "新建项目"应考虑直接导航到 `/admin/projects/new`。

### 3.2 前台 - 项目详情页图片数量显示位置不明显
**文件**: `gio-web/src/pages/ProjectDetail.tsx` (第374-378行)

```javascript
{project.images && project.images.length > 0 && (
  <span className="text-xs mt-2 block" style={{ color: '#666666' }}>
    共 {project.images.length} 张图片
  </span>
)}
```

**问题**: 图片总数显示在页面标题区域下方，字体很小（text-xs），用户可能不知道项目有多少张图片可以查看。

**建议**: 考虑在图片网格上方增加更明显的图片计数提示。

### 3.3 后台 - 表单验证提示不够友好
**文件**: `gio-web/src/admin/ProjectDetailPage.tsx` (第239-245行)

```javascript
if (!formData.name.trim()) {
  toast.error('请输入项目名称');
  return;
}
if (!formData.year) {
  toast.error('请输入项目年份');
  return;
}
```

**问题**: 缺少"年份格式"的校验（是否为有效年份、是否为合理范围），用户可能输入非数字字符。

### 3.4 前台 - 图片加载失败显示默认图片
**文件**: `gio-web/src/pages/ProjectDetail.tsx` (第217-220行)

```javascript
onError={(e) => {
  setIsImageLoading(false);
  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
}}
```

**问题**: 缩略图加载失败时使用默认大图而非默认缩略图，造成资源浪费和显示问题。

**建议**: 定义单独的 `DEFAULT_THUMB` 用于缩略图场景。

---

## 四、建议优化项

### 4.1 性能优化建议

1. **后台 - 分页组件重复代码多**
   - Messages、Projects、Copywriting、Categories 都有各自的分页实现
   - 建议抽取为公共 `<Pagination />` 组件

2. **前台 - 图片预加载**
   - Projects 列表页使用了 `fetchPriority` 和 `loading eager/lazy` 做区分
   - 建议对前 3 张图片也使用预加载，改善 LCP

3. **后台 - 骨架屏统一性**
   - 各个管理页面骨架屏动画和样式略有差异
   - 建议统一骨架屏设计

### 4.2 交互优化建议

1. **后台 - 操作反馈一致性**
   - 部分操作使用 toast 反馈，部分使用弹窗确认后显示 toast
   - 建议统一为"弹窗确认 -> 操作 -> toast 反馈"的流程

2. **前台 - 滚动行为优化**
   - Projects 页面使用 `smooth` 滚动，但首页快捷操作 `scrollToSection` 也用了 smooth
   - 建议首页使用 instant 滚动，保持与浏览器导航的一致性

3. **后台 - 表格排序**
   - 所有管理表格（留言、项目、推文、分类）均不支持按列排序
   - 建议对常用列（如时间、名称）增加排序功能

### 4.3 响应式设计建议

1. **后台 - 移动端适配**
   - 管理后台在移动端体验较差，表格横向滚动不流畅
   - 建议对移动端使用卡片列表替代表格

2. **前台 - 移动端图片网格**
   - ProjectDetail 移动端使用 3 列网格
   - 建议考虑 2 列布局增加每张图片的显示面积

---

## 五、已验证的良好实践

1. **前后台分离的 Layout 设计** - 后台 Layout 包含认证验证和统一的侧边栏/顶部导航
2. **批量操作设计** - Projects 页面的批量选择、批量状态修改、批量删除流程完整
3. **图片拖拽排序** - ProjectDetailPage 使用 @dnd-kit 实现了流畅的拖拽排序
4. **表单状态管理** - 使用 useState 管理表单状态，编辑/取消模式清晰
5. **键盘无障碍** - ProjectDetail 图片查看器支持左右箭头键切换、ESC 关闭
6. **加载状态处理** - 统一的 loading 骨架屏、空状态提示
7. **防抖搜索** - Projects 页面的分类切换防抖处理

---

## 六、优先级修复清单

| 优先级 | 问题 | 位置 |
|--------|------|------|
| P0 | 留言统计数据错误 | Dashboard.tsx |
| P0 | 图片查看器点击背景无法关闭 | ProjectDetail.tsx |
| P1 | 分页输入框 defaultValue 问题 | Copywriting.tsx |
| P1 | 侧边栏折叠后 tooltip 缺失 | Layout.tsx |
| P1 | 分类过滤无重置按钮 | Projects.tsx |
| P2 | 批量操作后复选框状态丢失 | Projects.tsx |
| P2 | 搜索无防抖 | Copywriting.tsx |
| P3 | Dashboard 快捷入口链接不精准 | Dashboard.tsx |
| P3 | 项目年份无格式校验 | ProjectDetailPage.tsx |
| P4 | 抽取公共 Pagination 组件 | - |
| P4 | 表格列排序功能 | - |

---

*报告生成时间: 2026-04-10*
*审查者: worker-1 (UX 审查)*
