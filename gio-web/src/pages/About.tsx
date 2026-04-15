import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyIntro from '@/components/CompanyIntro';
import PhilosophyCard from '@/components/PhilosophyCard';
import { COMPANY_INFO } from '@/constants/contact';
import { usePageTrack } from '@/hooks/usePageTrack';

// 服务流程
const SERVICE_PROCESS = [
  { step: '01', title: '需求沟通', desc: '深入了解客户需求，现场勘测，分析空间布局与使用场景' },
  { step: '02', title: '方案设计', desc: '根据需求定制照明方案，提供效果图与灯光模拟，确认设计' },
  { step: '03', title: '施工安装', desc: '专业团队施工安装，设备调试，确保照明效果完美呈现' },
  { step: '04', title: '售后维护', desc: '定期回访效果调试，智能系统后期维护，灯光效果优化' }
];

const About = () => {
  // 埋点 - 关于我们
  usePageTrack();

  // 页面首次加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Helmet>
        <title>关于我们 - 光里光外 GIO</title>
        <meta name="description" content="光里光外GIO团队始于2015年，是成都专业智能照明设计公司，10年行业经验，提供私宅、餐饮、办公、酒店等空间照明设计服务" />
        <meta name="keywords" content="关于照明设计公司,成都照明设计,智能照明设计团队,照明设计公司优势" />
        <link rel="canonical" href="http://140.143.87.54/about" />
      </Helmet>

      {/* 页面头部 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="section-label">About Us</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] text-white mt-3">
              关于 光里光外 <span className="text-[#d4a853]">GIO</span>
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* 公司介绍 - 使用 CompanyIntro 组件 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <CompanyIntro descriptions={COMPANY_INFO.descriptions} />
        </div>
      </section>

      {/* 团队优势 - 使用 COMPANY_INFO.stats */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="section-label">Our Advantages</span>
            <h2 className="section-title text-2xl md:text-3xl mt-3">团队优势</h2>
          </AnimatedSection>
          <div className="flex justify-center gap-8 md:gap-16">
            {Object.values(COMPANY_INFO.stats).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-light mb-2" style={{ color: '#d4a853' }}>{stat.value}</div>
                <div className="text-xs md:text-sm tracking-wider" style={{ color: '#666666' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="section-label">Service Process</span>
            <h2 className="section-title text-2xl md:text-3xl mt-3">服务流程</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {SERVICE_PROCESS.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-light mb-3" style={{ color: '#d4a853' }}>{item.step}</div>
                <h3 className="text-white text-sm md:text-base mb-2 tracking-wide">{item.title}</h3>
                <p className="text-xs md:text-sm" style={{ color: '#666666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心理念 - 使用 PhilosophyCard 组件 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title text-2xl md:text-3xl mt-3">核心理念</h2>
          </AnimatedSection>
          <PhilosophyCard />
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-xl md:text-2xl font-light text-white mb-4 tracking-wide">有合作意向？</h2>
            <p className="mb-8 text-sm md:text-base" style={{ color: '#666666' }}>欢迎联系我们，探讨您的智能照明设计需求</p>
            <Link to="/contact" className="btn-primary">
              立即联系
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;