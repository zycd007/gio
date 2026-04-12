import { useState, useEffect } from 'react';
import { getDashboardStats, getMessages } from '@/services/admin';
import { Link } from 'react-router-dom';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalCategories: number;
  totalImages: number;
  totalMessages: number;
  pendingMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalCategories: 0,
    totalImages: 0,
    totalMessages: 0,
    pendingMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getMessages(1, 1, 0), // 获取未处理留言 (status=0)
      getMessages(1, 1) // 获取所有留言
    ])
      .then(([dashboardData, pendingData, allData]) => {
        setStats({
          totalProjects: dashboardData.totalProjects || 0,
          publishedProjects: dashboardData.publishedProjects || 0,
          totalCategories: dashboardData.totalCategories || 0,
          totalImages: dashboardData.totalImages || 0,
          totalMessages: allData.total || 0,
          pendingMessages: pendingData.total || 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 统计卡片配置
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
      title: '分类数量',
      value: stats.totalCategories,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      link: '/admin/categories',
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

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* 统计卡片 - 2x2 网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative cursor-pointer ${
              card.alert ? 'border-2 border-amber-400 ring-4 ring-amber-100' : 'border border-slate-100'
            }`}
          >
            {/* 警示脉冲动画 */}
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
            {/* 底部装饰条 */}
            <div className={`h-1 mt-4 rounded-full bg-gradient-to-r ${card.color} ${card.alert ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;