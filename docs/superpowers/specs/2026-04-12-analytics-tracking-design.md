# 官网埋点统计系统设计

## 1. 背景与目标

为官网添加自建埋点系统，追踪用户访问行为，在后台仪表盘展示统计报表。

**核心目标：**
- 记录每日 UV（独立访客）、PV（页面浏览）
- 记录每个项目详情页的浏览次数
- 仪表盘展示趋势图表和项目排行
- 数据保留 30 天

---

## 2. 数据模型

### 2.1 页面访问日志表 `page_view_log`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键自增 |
| ip_hash | VARCHAR(64) | IP + UA 的 SHA256 哈希 |
| page_url | VARCHAR(512) | 页面路径 |
| referrer | VARCHAR(512) | 来源页面 |
| project_id | INT | 项目 ID（项目详情页有值） |
| user_agent | VARCHAR(512) | 浏览器 UA |
| duration | INT | 停留时长（秒） |
| visit_date | DATE | 访问日期 |
| created_at | DATETIME | 访问时间 |

### 2.2 每日统计表 `daily_stats`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| stat_date | DATE | 日期 |
| total_uv | INT | 当日 UV |
| total_pv | INT | 当日 PV |
| project_id | INT | 项目 ID（0 表示全局） |
| view_count | INT | 当日该项目浏览次数 |

**索引：** `(stat_date, project_id)` 复合索引

---

## 3. 埋点流程

### 3.1 页面浏览埋点

```
用户访问页面
    ↓
前端 JS 生成 pageview 事件
    ↓
异步 POST /api/track/pageview
    ↓
后端：IP + UA → SHA256 → ip_hash
    ↓
记录 page_view_log
    ↓
页面离开时（beforeunload）发送 duration 事件
    ↓
后端更新该条记录的停留时长
```

### 3.2 定时汇总任务

每日凌晨 02:00 执行（可调整），将 page_view_log 聚合写入 daily_stats，保留最近 30 天数据。

---

## 4. API 设计

### 4.1 埋点接口

**POST /api/track/pageview**

请求体：
```json
{
  "pageUrl": "/projects/123",
  "referrer": "/projects",
  "projectId": 123
}
```

响应：`{ "code": 0, "message": "success" }`

**POST /api/track/duration**

请求体：
```json
{
  "pageUrl": "/projects/123",
  "projectId": 123,
  "duration": 45
}
```

响应：`{ "code": 0, "message": "success" }`

### 4.2 仪表盘数据接口

**GET /api/admin/dashboard/stats**

响应：
```json
{
  "code": 0,
  "data": {
    "today": { "uv": 120, "pv": 350 },
    "trend": [
      { "date": "2026-04-05", "uv": 100, "pv": 280 },
      { "date": "2026-04-06", "uv": 120, "pv": 350 }
    ],
    "topProjects": [
      { "projectId": 5, "name": "xxx展厅", "viewCount": 89 },
      { "projectId": 12, "name": "yyy别墅", "viewCount": 76 }
    ]
  }
}
```

---

## 5. 前端埋点实现

### 5.1 TrackService

位置：`gio-web/src/services/TrackService.ts`

```typescript
// 页面浏览埋点
trackPageView(pageUrl: string, projectId?: number): void

// 页面离开发送时长
trackDuration(pageUrl: string, projectId?: number, duration: number): void
```

### 5.2 集成点

在 `App.tsx` 或页面组件的 `useEffect` 中调用：

```typescript
useEffect(() => {
  trackService.trackPageView(location.pathname, projectId);
  return () => {
    const duration = Date.now() - startTime;
    trackService.trackDuration(location.pathname, projectId, duration / 1000);
  };
}, [location.pathname]);
```

---

## 6. 后台仪表盘改造

位置：`gio-web/src/admin/Dashboard.tsx`

### 6.1 新增统计卡片

| 卡片 | 数据来源 |
|------|---------|
| 今日 UV | today.uv |
| 今日 PV | today.pv |

### 6.2 新增图表

- **近 7 天趋势图**：折线图（Recharts LineChart），X 轴日期，Y 轴 UV/PV
- **项目浏览排行**：水平柱状图（Recharts BarChart），展示前 10 个项目

### 6.3 依赖安装

```bash
cd gio-web
pnpm add recharts
```

---

## 7. 数据库变更

```sql
CREATE TABLE page_view_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip_hash VARCHAR(64) NOT NULL,
    page_url VARCHAR(512) NOT NULL,
    referrer VARCHAR(512),
    project_id INT DEFAULT 0,
    user_agent VARCHAR(512),
    duration INT DEFAULT 0,
    visit_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visit_date (visit_date),
    INDEX idx_project_date (project_id, visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE daily_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_uv INT DEFAULT 0,
    total_pv INT DEFAULT 0,
    project_id INT DEFAULT 0,
    view_count INT DEFAULT 0,
    UNIQUE KEY uk_date_project (stat_date, project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 8. 定时任务

使用 Spring `@Scheduled` 注解，每日凌晨 02:00 执行：

1. 聚合 page_view_log 写入 daily_stats
2. 删除 30 天前的 page_view_log 和 daily_stats 数据

---

## 9. 涉及文件

### 后端（gio-api）
| 文件 | 操作 |
|------|------|
| `entity/PageViewLog.java` | 新增 |
| `entity/DailyStats.java` | 新增 |
| `dto/PageViewRequest.java` | 新增 |
| `dto/DashboardStatsVO.java` | 新增 |
| `mapper/PageViewLogMapper.java` | 新增 |
| `mapper/DailyStatsMapper.java` | 新增 |
| `service/TrackService.java` | 新增 |
| `service/impl/TrackServiceImpl.java` | 新增 |
| `controller/TrackController.java` | 新增 |
| `controller/DashboardController.java` | 修改，添加统计接口 |
| `task/StatsAggregateTask.java` | 新增，定时汇总 |

### 前端（gio-web）
| 文件 | 操作 |
|------|------|
| `services/TrackService.ts` | 新增 |
| `hooks/usePageTrack.ts` | 新增，页面埋点 hook |
| `admin/Dashboard.tsx` | 修改，添加 UV/PV 卡片和图表 |

---

## 10. 实现顺序

1. 数据库建表
2. 后端实体类、Mapper、Service、Controller
3. 定时任务
4. 前端 TrackService + hook
5. 页面集成埋点
6. 仪表盘改造
