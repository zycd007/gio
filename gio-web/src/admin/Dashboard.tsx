import { useState, useEffect } from 'react';
import { getDashboardStats, getMessages, getDashboardAnalytics } from '@/services/admin';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale/zh-CN';
import 'react-datepicker/dist/react-datepicker.css';

// 注册中文 locale
registerLocale('zh-CN', zhCN);

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalSocialPosts: number;
  totalImages: number;
  totalMessages: number;
  pendingMessages: number;
}

interface TimeRangeInfo {
  days: number;
  startDate: string;
  endDate: string;
  label: string;
}

interface TodayStats {
  uv: number;
  pv: number;
}

interface TrendItem {
  date: string;
  uv: number;
  pv: number;
}

interface TopProject {
  projectId: number;
  name: string;
  viewCount: number;
}

interface PageHeatmapItem {
  pageUrl: string;
  viewCount: number;
  uv: number;
  pageTitle: string;
}

interface HourlyItem {
  hour: number;
  pv: number;
  uv: number;
}

interface AvgDurationStats {
  avgDurationSeconds: number;
  avgDurationFormatted: string;
}

interface ReferrerItem {
  referrer: string;
  count: number;
  referrerName: string;
  category: string;
}

interface DeviceStats {
  mobileCount: number;
  desktopCount: number;
  tabletCount: number;
  unknownCount: number;
  mobilePercent: number;
  desktopPercent: number;
  tabletPercent: number;
}

interface BounceRateStats {
  bounceRate: number;
  bounceCount: number;
  totalVisits: number;
  description: string;
}

interface VisitorTypeStats {
  newVisitorCount: number;
  returningVisitorCount: number;
  newVisitorPercent: number;
  returningVisitorPercent: number;
}

interface AnalyticsData {
  timeRange: TimeRangeInfo;
  today: TodayStats;
  trend: TrendItem[];
  topProjects: TopProject[];
  pageHeatmap: PageHeatmapItem[];
  hourlyStats: HourlyItem[];
  avgDuration: AvgDurationStats;
  referrerStats: ReferrerItem[];
  deviceStats: DeviceStats;
  bounceRate: BounceRateStats;
  visitorTypeStats: VisitorTypeStats;
}

type TimeRangeType = 'today' | '7days' | '30days' | 'year' | 'custom';

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalSocialPosts: 0,
    totalImages: 0,
    totalMessages: 0,
    pendingMessages: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('7days');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 加载数据
  const loadAnalytics = (range: TimeRangeType, start?: string, end?: string) => {
    setLoading(true);
    let days = 7;
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        days = 1;
        break;
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        return getDashboardAnalytics(undefined, startOfYear, today)
          .then((data) => setAnalytics(data))
          .finally(() => setLoading(false));
      case 'custom':
        if (start && end) {
          return getDashboardAnalytics(undefined, start, end)
            .then((data) => setAnalytics(data))
            .finally(() => setLoading(false));
        }
        days = 7;
        break;
    }

    getDashboardAnalytics(days)
      .then((data) => setAnalytics(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getMessages(1, 1, 0),
      getMessages(1, 1),
    ])
      .then(([dashboardData, pendingData, allData]) => {
        setStats({
          totalProjects: dashboardData.totalProjects || 0,
          publishedProjects: dashboardData.publishedProjects || 0,
          totalSocialPosts: dashboardData.totalSocialPosts || 0,
          totalImages: dashboardData.totalImages || 0,
          totalMessages: allData.total || 0,
          pendingMessages: pendingData.total || 0,
        });
      })
      .finally(() => {
        loadAnalytics(timeRange);
      });
  }, []);

  // 处理时间范围切换
  const handleTimeRangeChange = (range: TimeRangeType) => {
    setTimeRange(range);
    if (range !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    loadAnalytics(range, startDate ? formatDate(startDate) : undefined, endDate ? formatDate(endDate) : undefined);
  };

  // 处理日期选择
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setTimeRange('custom');
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      loadAnalytics('custom', formatDate(start), formatDate(end));
    }
  };

  // 基础统计卡片 - 绿色主题
  const statCards = [
    {
      title: '项目总数',
      value: stats.totalProjects,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      link: '/admin/projects',
    },
    {
      title: '已发布项目',
      value: stats.publishedProjects,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      link: '/admin/projects?status=1',
    },
    {
      title: '推文数量',
      value: stats.totalSocialPosts,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      link: '/admin/social-posts',
    },
    {
      title: '待处理留言',
      value: stats.pendingMessages,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      alert: stats.pendingMessages > 0,
      link: '/admin/messages?status=0',
    },
  ];

  // 设备分布数据
  const deviceData = analytics?.deviceStats
    ? [
        { name: '移动端', value: analytics.deviceStats.mobileCount, percent: analytics.deviceStats.mobilePercent },
        { name: '桌面端', value: analytics.deviceStats.desktopCount, percent: analytics.deviceStats.desktopPercent },
        { name: '平板', value: analytics.deviceStats.tabletCount, percent: analytics.deviceStats.tabletPercent },
      ]
    : [];

  // 渠道分类汇总
  const channelCategoryData = (() => {
    if (!analytics?.referrerStats) return [];
    const categoryMap = new Map<string, number>();
    analytics.referrerStats.forEach((item) => {
      const cat = item.category || 'other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.count);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name === 'direct' ? '直接访问' : name === 'search' ? '搜索引擎' : name === 'social' ? '社交媒体' : '其他',
      value,
    }));
  })();

  // 格式化趋势数据
  const trendData = analytics?.trend.map((item) => ({
    ...item,
    date: item.date.length > 5 ? item.date.substring(5) : item.date,
  })) || [];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* 时间范围选择器 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTimeRangeChange('today')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === 'today'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              今日
            </button>
            <button
              onClick={() => handleTimeRangeChange('7days')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === '7days'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              近 7 天
            </button>
            <button
              onClick={() => handleTimeRangeChange('30days')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === '30days'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              近 30 天
            </button>
            <button
              onClick={() => handleTimeRangeChange('year')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === 'year'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              本年
            </button>
          </div>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="yyyy-MM-dd"
              placeholderText="选择日期范围"
              locale="zh-CN"
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white w-[200px]"
              wrapperClassName="w-[200px]"
            />
          </div>
        </div>
        {analytics?.timeRange?.label && (
          <p className="text-sm text-slate-500 mt-2">
            当前范围：<span className="font-medium text-emerald-600">{analytics.timeRange.label}</span>
          </p>
        )}
      </div>

      {/* 统计卡片 - 基础信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative cursor-pointer ${
              card.alert ? 'border-2 border-amber-400 ring-4 ring-amber-100' : 'border border-slate-100'
            }`}
          >
            {card.alert && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-600 text-sm font-medium">
                  {card.title}
                  {card.alert && <span className="ml-2 text-amber-600 font-semibold">!</span>}
                </p>
                <p className={`text-3xl font-bold mt-2 ${card.alert ? 'text-amber-600' : 'text-slate-800'}`}>
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <div className={card.iconColor}>{card.icon}</div>
              </div>
            </div>
            <div className={`h-1 mt-4 rounded-full bg-gradient-to-r ${card.color} ${card.alert ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}></div>
          </Link>
        ))}
      </div>

      {/* 今日/核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* UV */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">独立访客 (UV)</p>
              <p className="text-4xl font-bold mt-2 text-slate-800">
                {loading ? '...' : analytics?.today.uv || 0}
              </p>
              <p className="text-slate-400 text-sm mt-1">去重访客数</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl">
              <div className="text-indigo-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-1 mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
        </div>

        {/* PV */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">页面浏览 (PV)</p>
              <p className="text-4xl font-bold mt-2 text-slate-800">
                {loading ? '...' : analytics?.today.pv || 0}
              </p>
              <p className="text-slate-400 text-sm mt-1">总访问次数</p>
            </div>
            <div className="bg-cyan-50 p-4 rounded-xl">
              <div className="text-cyan-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-1 mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
        </div>

        {/* 跳出率 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">跳出率</p>
              <p className="text-4xl font-bold mt-2 text-slate-800">
                {loading ? '...' : (analytics?.bounceRate?.bounceRate || 0) + '%'}
              </p>
              <p className="text-slate-400 text-sm mt-1">停留 {'<'} 5 秒的访问</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl">
              <div className="text-rose-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-1 mt-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600"></div>
        </div>

        {/* 平均停留时长 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">平均停留</p>
              <p className="text-4xl font-bold mt-2 text-slate-800">
                {loading ? '...' : analytics?.avgDuration?.avgDurationFormatted || '0 秒'}
              </p>
              <p className="text-slate-400 text-sm mt-1">每次访问时长</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl">
              <div className="text-amber-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="h-1 mt-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
        </div>
      </div>

      {/* 新老访客统计 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">新老访客分析</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{analytics?.visitorTypeStats?.newVisitorCount || 0}</p>
            <p className="text-slate-500 text-sm mt-1">新访客数</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{analytics?.visitorTypeStats?.returningVisitorCount || 0}</p>
            <p className="text-slate-500 text-sm mt-1">老访客数</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 mx-auto relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="8"
                  strokeDasharray={`${(analytics?.visitorTypeStats?.newVisitorPercent || 0) * 1.75} 176`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                {analytics?.visitorTypeStats?.newVisitorPercent || 0}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">新访客占比</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 mx-auto relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(analytics?.visitorTypeStats?.returningVisitorPercent || 0) * 1.75} 176`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                {analytics?.visitorTypeStats?.returningVisitorPercent || 0}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">老访客占比</p>
          </div>
        </div>
      </div>

      {/* 访问趋势图 */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">访问趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  name="UV"
                />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPv)"
                  name="PV"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 第一行：设备分布 + 渠道来源 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 设备分布 */}
        {analytics?.deviceStats && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">设备类型分布</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      fontSize={11}
                    >
                      {deviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-600 text-sm">移动端</span>
                  </div>
                  <span className="text-slate-800 font-semibold">{analytics.deviceStats.mobilePercent}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-slate-600 text-sm">桌面端</span>
                  </div>
                  <span className="text-slate-800 font-semibold">{analytics.deviceStats.desktopPercent}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-slate-600 text-sm">平板</span>
                  </div>
                  <span className="text-slate-800 font-semibold">{analytics.deviceStats.tabletPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 渠道来源分析 */}
        {channelCategoryData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">渠道来源分析</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      fontSize={11}
                    >
                      {channelCategoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {channelCategoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600 text-sm">{item.name}</span>
                    </div>
                    <span className="text-slate-800 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 详细来源列表 */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">详细来源</h4>
              <div className="space-y-2 max-h-32 overflow-auto">
                {analytics?.referrerStats?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 truncate">{item.referrerName}</span>
                    <span className="text-slate-800 font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 第二行：项目浏览排行 + 页面访问热度 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 项目浏览排行 */}
        {analytics?.topProjects && analytics.topProjects.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">项目浏览排行 TOP10</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topProjects} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    width={120}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="viewCount"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    name="浏览量"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 页面访问热度 */}
        {analytics?.pageHeatmap && analytics.pageHeatmap.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">页面访问热度 TOP10</h3>
            <div className="space-y-3">
              {analytics.pageHeatmap.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.pageTitle}</span>
                      <span className="text-slate-500 text-sm">{item.viewCount} PV</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${(item.viewCount / (analytics.pageHeatmap[0]?.viewCount || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 第三行：24 小时访问分布 */}
      {analytics?.hourlyStats && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">24 小时访问分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="hour"
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => `${label}:00`}
                />
                <Bar
                  dataKey="pv"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  name="PV"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;