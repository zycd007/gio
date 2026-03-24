import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyIntro from '@/components/CompanyIntro';
import PhilosophyCard from '@/components/PhilosophyCard';
import ServiceAreas from '@/components/ServiceAreas';

// 公司介绍文字
const COMPANY_DESCRIPTIONS = [
  '光里光外 GIO 成立于 2010 年，是一家专注于智能照明全案设计的知名公司。我们的团队由经验丰富的照明设计师组成，致力于为客户创造独特而富有灵感的照明方案。',
  '我们相信照明设计不仅仅是提供光源，更是对生活品质的提升和空间氛围的营造。每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。',
  '多年来，我们完成了众多备受赞誉的智能照明项目，涵盖私宅空间、餐饮空间、娱乐空间等多个领域。我们的设计理念是"以光塑形，以影传情"，追求光影与空间的完美融合，同时注重节能与智能化。'
];

const About = () => {
  // 页面首次加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
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
          <CompanyIntro descriptions={COMPANY_DESCRIPTIONS} />
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

      {/* 服务领域 - 使用 ServiceAreas 组件 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <ServiceAreas />
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