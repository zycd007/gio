import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/services/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalCategories: 0,
    totalImages: 0,
  });

  useEffect(() => {
    // 加载统计数据
    getDashboardStats().then((data) => {
      setStats({
        totalProjects: data.totalProjects || 0,
        publishedProjects: data.publishedProjects || 0,
        totalCategories: data.totalCategories || 0,
        totalImages: data.totalImages || 0,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-light text-gray-800 mb-6">仪表盘</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">项目总数</p>
              <p className="text-3xl font-light text-gray-800">{stats.totalProjects}</p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">已发布项目</p>
              <p className="text-3xl font-light text-gray-800">{stats.publishedProjects}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">分类数量</p>
              <p className="text-3xl font-light text-gray-800">{stats.totalCategories}</p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">图片总数</p>
              <p className="text-3xl font-light text-gray-800">{stats.totalImages}</p>
            </div>
            <div className="text-4xl">🖼️</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">快速入口</h2>
        <div className="flex gap-4">
          <a href="/admin/projects" className="btn-primary px-6 py-2">
            管理项目
          </a>
          <a href="/admin/categories" className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            管理分类
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
