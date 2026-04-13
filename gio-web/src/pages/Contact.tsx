import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AnimatedSection from '@/components/AnimatedSection';
import ContactInfo from '@/components/ContactInfo';
import { usePageTrack } from '@/hooks/usePageTrack';

const Contact = () => {
  // 埋点 - 联系我们
  usePageTrack();

  // 页面首次加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Helmet>
        <title>联系我们 - 光里光外 GIO</title>
        <meta name="description" content="联系光里光外GIO智能照明设计公司，获取免费照明设计方案咨询" />
        <meta name="keywords" content="成都照明设计咨询,智能照明联系方式,照明设计公司地址" />
        <link rel="canonical" href="http://140.143.87.54/contact" />
      </Helmet>

      {/* 页面头部 */}
      <section className="py-10 md:py-14" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
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
          <div className="max-w-xl mx-auto">
            <ContactInfo delayClassName="delay-200" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;