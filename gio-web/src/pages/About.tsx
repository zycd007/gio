const About = () => {
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <section className="bg-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label">About Us</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-widest text-white mt-2">
            关于 光里光外 <span className="text-primary">GIO</span>
          </h1>
        </div>
      </section>

      {/* 公司介绍 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
              光里光外 GIO 成立于 2010 年，是一家专注于智能照明全案设计的知名公司。
              我们的团队由经验丰富的照明设计师组成，致力于为客户创造独特而富有灵感的照明方案。
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
              我们相信照明设计不仅仅是提供光源，更是对生活品质的提升和空间氛围的营造。
              每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              多年来，我们完成了众多备受赞誉的智能照明项目，涵盖私宅空间、餐饮空间、娱乐空间等多个领域。
              我们的设计理念是"以光塑形，以影传情"，追求光影与空间的完美融合，同时注重节能与智能化。
            </p>
          </div>
        </div>
      </section>

      {/* 核心理念 */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title text-2xl md:text-3xl mt-2">核心理念</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 md:p-8 bg-white">
              <div className="text-4xl md:text-5xl mb-4">🎯</div>
              <h3 className="text-lg md:text-xl font-medium mb-3">专注品质</h3>
              <p className="text-gray-500 text-sm md:text-base">
                我们坚持高标准的照明设计品质，关注每一个细节，确保每个项目都能达到最佳效果。
              </p>
            </div>
            <div className="text-center p-6 md:p-8 bg-white">
              <div className="text-4xl md:text-5xl mb-4">💡</div>
              <h3 className="text-lg md:text-xl font-medium mb-3">智能创新</h3>
              <p className="text-gray-500 text-sm md:text-base">
                我们不断探索智能照明新技术，为客户创造节能、环保、智能化的照明解决方案。
              </p>
            </div>
            <div className="text-center p-6 md:p-8 bg-white">
              <div className="text-4xl md:text-5xl mb-4">🤝</div>
              <h3 className="text-lg md:text-xl font-medium mb-3">客户至上</h3>
              <p className="text-gray-500 text-sm md:text-base">
                我们以客户需求为核心，提供个性化的照明设计服务，确保客户满意。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 服务领域 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="section-label">Our Services</span>
            <h2 className="section-title text-2xl md:text-3xl mt-2">服务领域</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🏠', name: '私宅照明', en: 'Residence' },
              { icon: '🍽️', name: '餐饮照明', en: 'Restaurant' },
              { icon: '🎵', name: '娱乐照明', en: 'Entertainment' },
              { icon: '💼', name: '办公照明', en: 'Office' },
              { icon: '🏨', name: '酒店照明', en: 'Hotel' },
            ].map((item) => (
              <div key={item.name} className="text-center p-4 md:p-6 border border-gray-100">
                <div className="text-3xl md:text-4xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-light mb-4">有合作意向？</h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">欢迎联系我们，探讨您的智能照明设计需求</p>
          <a href="/contact" className="btn-primary inline-block active:scale-95 transition-transform">
            立即联系
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
