import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/projects', label: '案例' },
    { path: '/about', label: '关于' },
    { path: '/contact', label: '联系' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-dark text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl md:text-2xl font-light tracking-widest text-primary">
              光里光外 <span className="text-white">GIO</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wider transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-white p-2 -mr-2 active:opacity-70 transition-opacity"
              onClick={toggleMobileMenu}
              aria-label="菜单"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端菜单抽屉 */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-dark/95 backdrop-blur-sm border-t border-gray-800">
            <nav className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`block py-3 text-base tracking-wider transition-colors border-b border-gray-800 last:border-0 ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-dark text-gray-400 py-6 md:py-8">
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
    </div>
  );
};

export default Layout;
