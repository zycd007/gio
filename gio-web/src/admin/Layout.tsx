import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/admin';

// 面包屑配置
const breadcrumbMap: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/messages': '客户留言',
  '/admin/projects': '项目管理',
  '/admin/categories': '分类管理',
  '/admin/social-posts': '推文管理',
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const hasValidated = useRef(false);

  useEffect(() => {
    // 只在首次加载时验证 token，避免路由切换时重复验证导致页面闪烁
    if (hasValidated.current) return;
    hasValidated.current = true;

    const validateToken = async () => {
      setIsValidating(true);
      try {
        await getCurrentUser();
      } catch {
        localStorage.removeItem('admin_token');
        navigate('/admin/login', { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    const token = localStorage.getItem('admin_token');
    if (token) {
      validateToken();
      // 定期验证（每5分钟）
      const interval = setInterval(validateToken, 5 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setIsValidating(false);
      if (location.pathname !== '/admin/login') {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [navigate]);

  
  // 登录页单独渲染
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  // 验证中显示加载状态
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">验证中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* 侧边栏 - 可折叠设计 */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} bg-slate-900 flex flex-col transition-all duration-300 relative group shrink-0`}>
        {/* Logo 区域 - 紧凑 */}
        <div className="h-12 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span className="text-white font-semibold text-sm tracking-wider">GIO 管理</span>
            )}
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          <NavLink to="/admin" icon="dashboard" collapsed={sidebarCollapsed} active={location.pathname === '/admin'}>
            仪表盘
          </NavLink>
          <NavLink to="/admin/projects" icon="projects" collapsed={sidebarCollapsed} active={location.pathname === '/admin/projects'}>
            项目管理
          </NavLink>
          <NavLink to="/admin/social-posts" icon="edit" collapsed={sidebarCollapsed} active={location.pathname.startsWith('/admin/social-posts')}>
            推文管理
          </NavLink>
          <NavLink to="/admin/messages" icon="inbox" collapsed={sidebarCollapsed} active={location.pathname === '/admin/messages'}>
            客户留言
          </NavLink>
          <NavLink to="/admin/categories" icon="tags" collapsed={sidebarCollapsed} active={location.pathname === '/admin/categories'}>
            分类管理
          </NavLink>
        </nav>

        {/* 底部 - 折叠按钮 */}
        <div className="p-2 border-t border-slate-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!sidebarCollapsed && <span className="text-sm">收起菜单</span>}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部导航 - 极简设计 */}
        <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          {/* 左侧 - 面包屑 */}
          <nav className="flex items-center text-sm">
            <Link to="/admin" className="text-slate-500 hover:text-emerald-600 transition-colors">首页</Link>
            {location.pathname !== '/admin' && (
              <>
                <span className="mx-1.5 text-slate-300">/</span>
                <span className="text-slate-800 font-medium">{breadcrumbMap[location.pathname] || ''}</span>
              </>
            )}
          </nav>

          {/* 右侧 - 用户头像 */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
              管
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// 导航链接组件
interface NavLinkProps {
  to: string;
  icon: 'dashboard' | 'inbox' | 'projects' | 'tags' | 'edit';
  collapsed: boolean;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, collapsed, active, children }: NavLinkProps) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />,
    projects: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    tags: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  };

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-emerald-600 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      } ${collapsed ? 'justify-center' : ''}`}
      title={String(children)}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
      {!collapsed && <span className="text-sm">{children}</span>}
    </Link>
  );
};

export default AdminLayout;