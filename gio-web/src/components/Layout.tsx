import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  // PC端顶部导航配置
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/projects', label: '案例' },
    { path: '/about', label: '关于' },
    { path: '/contact', label: '联系' },
  ];

  // 移动端底部Tab配置（带图标）
  const tabItems = [
    {
      path: '/',
      label: '首页',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/projects',
      label: '案例',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      path: '/about',
      label: '关于',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      path: '/contact',
      label: '联系',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col pb-[60px] md:pb-0">
      {/* PC端头部导航 - 移动端隐藏 */}
      <header className="bg-dark text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl md:text-2xl font-light tracking-widest text-primary">
              光里光外 <span className="text-white">GIO</span>
            </Link>
            {/* PC端导航 */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wider transition-colors ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* 移动端只显示Logo，不显示菜单按钮 */}
            <div className="md:hidden" />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* PC端页脚 - 移动端隐藏 */}
      <footer className="bg-dark text-gray-400 py-6 md:py-8 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">© 2026 光里光外 GIO。All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">智能照明全案设计</p>
            </div>
            <div className="flex space-x-4 md:space-x-6">
              <a href="#" className="text-sm hover:text-primary transition-colors active:opacity-70">微信公众号</a>
              <a href="#" className="text-sm hover:text-primary transition-colors active:opacity-70">微博</a>
              <a href="#" className="text-sm hover:text-primary transition-colors active:opacity-70">小红书</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 移动端底部Tab导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-gray-800 z-50 safe-area-pb">
        <div className="flex justify-around items-center h-[60px]">
          {tabItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors active:opacity-70 ${
                  active ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {item.icon(active)}
                <span className={`text-[10px] mt-0.5 ${active ? 'text-primary' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
