import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCategories, getProjects, getFeaturedProjects } from '@/services/project';
import { useAppContext } from '@/App';
import AnimatedSection from '@/components/AnimatedSection';
import CategoryCard from '@/components/CategoryCard';
import ProjectCard from '@/components/ProjectCard';
import ContactInfo from '@/components/ContactInfo';
import ContactForm from '@/components/ContactForm';
import TestimonialCard from '@/components/TestimonialCard';
import { ProjectCardSkeleton } from '@/components/Skeleton';
import { TESTIMONIALS } from '@/constants/contact';

const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const { setCategories: setContextCategories, setProjects: setContextProjects } = useAppContext();

  useEffect(() => {
    // 进入页面时滚动到顶部
    window.scrollTo(0, 0);

    getCategories().then((data) => {
      setCategories(data);
      setContextCategories(data);
    });

    // 尝试获取精选项目，如果失败则获取全部项目
    getFeaturedProjects().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
        setContextProjects(data);
      } else {
        getProjects(1, 100).then((data) => {
          setProjects(data.list);
          setContextProjects(data.list);
        });
      }
      setProjectsLoading(false);
    }).catch(() => {
      getProjects(1, 100).then((data) => {
        setProjects(data.list);
        setContextProjects(data.list);
        setProjectsLoading(false);
      });
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerHeight = 60;
      const targetY = el.offsetTop - headerHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div id="home">
      <Helmet>
        <title>光里光外 GIO - 专注空间智能照明设计</title>
        <meta name="description" content="光里光外GIO是成都专业智能照明设计公司，专注私宅、餐饮、办公、酒店等空间照明设计，提供智能照明全案解决方案" />
        <meta name="keywords" content="成都照明设计,智能照明设计,室内照明,酒店照明,餐厅照明,办公照明,照明设计公司" />
        <link rel="canonical" href="http://140.143.87.54/" />
      </Helmet>

      {/* 首页区域 */}
      <div className="min-h-screen">
        {/* Hero Banner - 独特设计 */}
        <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
          {/* 背景纹理 */}
          <div className="absolute inset-0 bg-texture" />

          {/* 渐变叠加 */}
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.6) 100%)'
          }} />

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ opacity: 0.7, filter: 'contrast(1.1) saturate(0.9)' }}
          />

          {/* 光效效果 */}
          <div className="absolute inset-0 z-10" style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 168, 83, 0.08) 0%, transparent 60%)'
          }} />

          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <p className="text-[#d4a853] text-xs md:text-sm tracking-[0.5em] mb-6 uppercase animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Smart Lighting Design
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                光里光外 <span className="text-[#d4a853]">GIO</span>
              </h1>
              <p className="text-[#a0a0a0] text-base md:text-xl max-w-xl mx-auto font-light px-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                专注空间智能照明设计
              </p>
              <button
                onClick={() => scrollToSection('featured')}
                className="btn-primary animate-fade-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                探索作品
              </button>
            </div>
          </div>

          {/* 向下滚动指示器 */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <svg className="w-6 h-6 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* 分类预览 - 使用 CategoryCard 组件 */}
        <div className="py-16 md:py-24" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12 md:mb-20">
              <span className="section-label">Our Expertise</span>
              <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3">专业领域</h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {categories.map((cat, index) => (
                <CategoryCard key={cat.id} category={cat} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* 精选作品 - 使用 ProjectCard 组件 */}
        <div id="featured" className="py-16 md:py-24" style={{ backgroundColor: '#141414' }}>
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12 md:mb-20">
              <span className="section-label">Featured Works</span>
              <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3">精选作品</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projectsLoading ? (
                // 加载骨架屏
                Array.from({ length: 3 }).map((_, index) => (
                  <AnimatedSection key={index} delay={index * 100} immediate>
                    <ProjectCardSkeleton />
                  </AnimatedSection>
                ))
              ) : (
                // 正常项目卡片
                projects.slice(0, 6).map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))
              )}
            </div>
            {!projectsLoading && (
              <AnimatedSection className="text-center mt-12 md:mt-16">
                <Link to="/projects" className="btn-primary">
                  查看更多作品
                </Link>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>

      {/* 关于区域 */}
      <section id="about" className="min-h-screen py-16 md:py-24" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <span className="section-label">About Us</span>
            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3">关于 光里光外 <span className="text-[#d4a853]">GIO</span></h2>
          </AnimatedSection>

          {/* 公司介绍 */}
          <AnimatedSection className="max-w-5xl mx-auto mb-16 md:mb-20">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2 relative">
                {/* 装饰边框 */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l" style={{ borderColor: '#d4a853' }} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r" style={{ borderColor: '#d4a853' }} />
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt="About"
                  loading="lazy"
                  className="w-full h-[250px] md:h-[400px] object-cover"
                  style={{ filter: 'grayscale(20%)' }}
                />
              </div>
              <div className="md:w-1/2">
                <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: '#a0a0a0' }}>
                  光里光外 GIO 成立于 2010 年，是一家专注于智能照明全案设计的知名公司。
                  我们的团队由经验丰富的照明设计师组成，致力于为客户创造独特而富有灵感的照明方案。
                </p>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#a0a0a0' }}>
                  我们相信照明设计不仅仅是提供光源，更是对生活品质的提升和空间氛围的营造。
                  每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* 核心理念 - 使用 PhilosophyCard 组件 */}
          <AnimatedSection className="mb-12 md:mb-16">
            <div className="text-center mb-10 md:mb-12">
              <span className="section-label">Our Philosophy</span>
              <h3 className="section-title text-xl md:text-2xl mt-3">核心理念</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {[
                { icon: '🎯', title: '专注品质', desc: '我们坚持高标准的照明设计品质，关注每一个细节，确保每个项目都能达到最佳效果。' },
                { icon: '💡', title: '智能创新', desc: '我们不断探索智能照明新技术，为客户创造节能、环保、智能化的照明解决方案。' },
                { icon: '🤝', title: '客户至上', desc: '我们以客户需求为核心，提供个性化的照明设计服务，确保客户满意。' }
              ].map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 150}>
                  <div className="text-center p-8 md:p-10 transition-all duration-500 card-hover" style={{ backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a' }}>
                    <div className="text-3xl md:text-4xl mb-5">{item.icon}</div>
                    <h4 className="text-lg md:text-xl font-light text-white mb-4 tracking-wide">{item.title}</h4>
                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#666666' }}>
                      {item.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 客户评价 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title text-2xl md:text-3xl mt-3">客户评价</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <AnimatedSection key={testimonial.id} delay={index * 150}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 联系区域 - 使用 ContactInfo 和 ContactForm 组件 */}
      <section id="contact" className="py-12 md:py-16" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10 md:mb-12">
            <span className="section-label">Contact Us</span>
            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3">联系我们</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
            <ContactInfo />
            <AnimatedSection className="delay-400">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 md:mb-10 tracking-wide">在线留言</h2>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;