const About = () => {
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label">About Us</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mt-2">
            关于 GIO&SJ
          </h1>
        </div>
      </section>

      {/* 公司介绍 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              GIO&SJ 设计事务所成立于 2010 年，是一家专注于高端室内设计的知名事务所。
              我们的团队由经验丰富的设计师组成，致力于为客户创造独特而富有灵感的空间。
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              我们相信设计不仅仅是美学，更是对生活方式的理解和诠释。
              每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              多年来，我们完成了众多备受赞誉的项目，涵盖私宅空间、餐饮空间、娱乐空间等多个领域。
              我们的设计理念是"简约而不简单"，追求空间的本质美感，同时注重功能性和舒适度。
            </p>
          </div>
        </div>
      </section>

      {/* 核心理念 */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title text-3xl mt-2">核心理念</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-medium mb-3">专注品质</h3>
              <p className="text-gray-500">
                我们坚持高标准的设计品质，关注每一个细节，确保每个项目都能达到最佳效果。
              </p>
            </div>
            <div className="text-center p-8 bg-white">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-medium mb-3">创新设计</h3>
              <p className="text-gray-500">
                我们不断探索新的设计语言和表达方式，为客户创造独特而有辨识度的空间。
              </p>
            </div>
            <div className="text-center p-8 bg-white">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-medium mb-3">客户至上</h3>
              <p className="text-gray-500">
                我们以客户需求为核心，提供个性化的设计服务，确保客户满意。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 服务领域 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-label">Our Services</span>
            <h2 className="section-title text-3xl mt-2">服务领域</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🏠', name: '私宅空间', en: 'Residence' },
              { icon: '🍽️', name: '餐饮空间', en: 'Restaurant' },
              { icon: '🎵', name: '娱乐空间', en: 'Entertainment' },
              { icon: '💼', name: '办公空间', en: 'Office' },
              { icon: '🏨', name: '酒店民宿', en: 'Hotel' },
            ].map((item) => (
              <div key={item.name} className="text-center p-6 border border-gray-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4">有合作意向？</h2>
          <p className="text-gray-400 mb-8">欢迎联系我们，探讨您的设计需求</p>
          <a href="/contact" className="btn-primary inline-block">
            立即联系
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
