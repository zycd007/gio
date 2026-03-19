import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (!isLoggedIn && location.pathname !== '/admin/login') {
    navigate('/admin/login');
    return null;
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-light tracking-widest text-primary">GIO&SJ</h1>
          <p className="text-xs text-gray-400 mt-1">后台管理系统</p>
        </div>
        <nav className="flex-1 px-4 py-4">
          <Link
            to="/admin"
            className={`block px-4 py-2 rounded mb-2 transition-colors ${
              location.pathname === '/admin'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            📊 仪表盘
          </Link>
          <Link
            to="/admin/projects"
            className={`block px-4 py-2 rounded mb-2 transition-colors ${
              location.pathname === '/admin/projects'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            📁 项目管理
          </Link>
          <Link
            to="/admin/categories"
            className={`block px-4 py-2 rounded mb-2 transition-colors ${
              location.pathname === '/admin/categories'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            🏷️ 分类管理
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            🚪 退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">后台管理</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">管理员</span>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
