import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import ContactInfo from '@/components/ContactInfo';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  const navigate = useNavigate();

  // 页面首次加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* 页面头部 */}
      <section className="py-10 md:py-14" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <button
              onClick={() => navigate('/')}
              className="group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-white/10 mb-4 md:mb-5"
              style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', marginLeft: 'auto', marginRight: 'auto' }}
              aria-label="返回首页"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#d4a853' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <span className="section-label">Contact Us</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] text-white mt-3">
              联系我们
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
            <ContactInfo delayClassName="delay-200" />
            <AnimatedSection className="delay-400">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 md:mb-10 tracking-wide">在线留言</h2>
              <ContactForm rows={4} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 地图 - 占位区域 */}
      <section className="h-64 md:h-96 relative" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: '#141414' }}>
          <svg className="w-12 h-12 mb-3" style={{ color: '#333333' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-sm" style={{ color: '#666666' }}>地图区域</span>
        </div>
      </section>
    </div>
  );
};

export default Contact;