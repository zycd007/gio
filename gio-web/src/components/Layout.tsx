import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'home', label: '首页' },
  { id: 'featured', label: '案例' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isAtContactSection, setIsAtContactSection] = useState(false);
  const isNavigatingRef = useRef(false);

  // 检查是否在首页（根路径）
  const isHomePage = location.pathname === '/';
  // 检查是否在联系我们页面
  const isContactPage = location.pathname === '/contact';

  // 处理 hash 路由导航
  useEffect(() => {
    // 只在首页时处理 hash 滚动
    if (!isHomePage) return;

    const hash = location.hash || window.location.hash;
    if (hash) {
      isNavigatingRef.current = true;
      const targetId = hash.replace('#', '');
      // 延迟执行，确保 DOM 完全渲染
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const headerHeight = 60;
          const targetY = el.offsetTop - headerHeight;
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
        // 导航完成后重置标志
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }, 100);
    }
  }, [location, isHomePage]);

  // 组件挂载时检查 hash（处理从其他页面导航过来的情况）
  useEffect(() => {
    const hash = window.location.hash;
    if (isHomePage && hash) {
      isNavigatingRef.current = true;
      const targetId = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const headerHeight = 60;
          const targetY = el.offsetTop - headerHeight;
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
        // 导航完成后重置标志
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }, 100);
    }
  }, [isHomePage]);

  // 监听滚动状态
  useEffect(() => {
    const handleScroll = () => {
      // 如果正在导航中，跳过滚动监听
      if (isNavigatingRef.current) return;

      setScrolled(window.scrollY > 50);

      const scrollPos = window.scrollY + 150;

      for (const section of SECTIONS) {
        // 跳过contact和about，因为已拆分为独立页面
        if (section.id === 'contact' || section.id === 'about') continue;

        const el = document.getElementById(section.id);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetHeight = el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // 检测首页的联系区域
      if (isHomePage) {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          const contactTop = contactEl.offsetTop;
          // 当滚动到联系区域时隐藏按钮
          setIsAtContactSection(scrollPos >= contactTop);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // 导航点击处理
  const handleNavClick = (sectionId: string) => {
    // 点击时直接设置高亮状态
    setActiveSection(sectionId);

    // contact 跳转到独立页面
    if (sectionId === 'contact') {
      navigate('/contact');
      return;
    }

    // about 跳转到独立页面
    if (sectionId === 'about') {
      navigate('/about');
      return;
    }

    // featured/案例 跳转到项目列表页
    if (sectionId === 'featured') {
      navigate('/projects');
      return;
    }

    // 其他区块在首页内滚动
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      navigate('/');
    }
  };

  // 滚动到指定区块
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerHeight = 60;
      const targetY = el.offsetTop - headerHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // 滚动到联系表单
  const scrollToContact = () => {
    if (!isHomePage) {
      navigate('/contact');
    } else {
      scrollToSection('contact');
    }
  };

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 移动端底部Tab配置
  const tabItems = [
    {
      id: 'home',
      label: '首页',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-[#d4a853]' : 'text-[#666666]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'featured',
      label: '案例',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-[#d4a853]' : 'text-[#666666]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'about',
      label: '关于',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-[#d4a853]' : 'text-[#666666]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'contact',
      label: '联系',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-[#d4a853]' : 'text-[#666666]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-[60px] md:pb-0" style={{ backgroundColor: '#0a0a0a' }}>
      {/* PC端头部导航 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center h-[60px] ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md' : 'bg-[#0a0a0a]/95'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (isHomePage) {
                  scrollToSection('home');
                } else {
                  navigate('/');
                }
              }}
              className="text-lg md:text-xl font-light tracking-[0.3em] transition-all duration-300 hover:opacity-80"
              style={{ color: '#d4a853' }}
            >
              光里光外 <span style={{ color: '#f5f5f5' }}>GIO</span>
            </button>
            {/* PC端导航 */}
            <nav className="hidden md:flex space-x-10">
              {SECTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs tracking-[0.2em] transition-all duration-300 link-underline ${
                    activeSection === item.id ? 'text-[#d4a853]' : 'text-[#a0a0a0] hover:text-[#f5f5f5]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="md:hidden" />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* PC端页脚 */}
      <footer className="py-8 md:py-12" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs tracking-wider" style={{ color: '#a0a0a0' }}>© 2026 光里光外 GIO。All rights reserved.</p>
              <p className="text-xs mt-2" style={{ color: '#666666' }}>智能照明全案设计</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 移动端底部Tab导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
        <div className="flex justify-around items-center h-[60px]">
          {tabItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                  active ? 'text-[#d4a853]' : 'text-[#666666]'
                }`}
              >
                {item.icon(active)}
                <span className={`text-[10px] mt-0.5 tracking-wider ${active ? 'text-[#d4a853]' : 'text-[#666666]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 返回顶部按钮 */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 opacity-0 translate-y-4"
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0)' : 'translateY(1rem)',
          pointerEvents: scrolled ? 'auto' : 'none'
        }}
        aria-label="返回顶部"
      >
        <span className="text-lg">↑</span>
      </button>

      {/* 悬浮咨询按钮 */}
      {!isContactPage && !isAtContactSection && (
        <button
          onClick={scrollToContact}
          className="fixed bottom-24 right-6 z-40 md:bottom-8 md:right-8 px-6 py-3 rounded-full text-white text-sm tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: '#d4a853' }}
        >
          免费获取方案
        </button>
      )}
    </div>
  );
};

export default Layout;