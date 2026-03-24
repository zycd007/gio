import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProjects } from '@/services/project';

// 分类图片映射
const categoryImages: Record<string, string> = {
  residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  club: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
  exhibition: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80',
  clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
};

interface Category {
  id: number;
  name: string;
  code: string;
}

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  coverImageId?: number;
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 加载分类
    getCategories().then((data) => {
      setCategories(data.slice(0, 6));
    });

    // 加载推荐项目
    getProjects(1, 6).then((data) => {
      setProjects(data.list);
    });
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
          alt="Hero"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-primary text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
              Smart Lighting Design
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-widest mb-6">
              光里光外 <span className="text-primary">GIO</span>
            </h1>
            <p className="text-gray-300 text-base md:text-xl max-w-xl mx-auto font-light px-4">
              智能照明全案设计公司
            </p>
            <Link to="/projects" className="inline-block mt-8 md:mt-10 btn-primary active:scale-95 transition-transform">
              探索作品
            </Link>
          </div>
        </div>
      </section>

      {/* 分类预览 */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <span className="section-label">Our Expertise</span>
            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-2">专业领域</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects?category=${cat.code}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
              >
                <img
                  src={categoryImages[cat.code] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80'}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选作品 */}
      <section className="py-12 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <span className="section-label">Featured Works</span>
            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-2">精选作品</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <div className="aspect-[4/3] md:aspect-square overflow-hidden">
                  <img
                    src={project.coverImageId ? `/api/images/${project.coverImageId}` : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'}
                    alt={project.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80';
                    }}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">{project.name}</h3>
                  <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 md:mt-12">
            <Link to="/projects" className="btn-primary inline-block active:scale-95 transition-transform">
              查看更多作品
            </Link>
          </div>
        </div>
      </section>

      {/* 关于我们简介 */}
      <section className="py-12 md:py-20 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 order-2 md:order-1">
              <span className="section-label">About Us</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-widest mt-2 mb-6 md:mb-8">
                关于 光里光外 <span className="text-primary">GIO</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                光里光外 GIO 成立于 2010 年，是一家专注于智能照明全案设计的知名公司。
                我们的团队由经验丰富的照明设计师组成，致力于为客户创造独特而富有灵感的照明方案。
              </p>
              <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                我们相信照明设计不仅仅是提供光源，更是对生活品质的提升和空间氛围的营造。
                每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。
              </p>
              <Link to="/about" className="text-primary hover:text-white transition-colors inline-flex items-center active:opacity-70">
                了解更多
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="About"
                loading="lazy"
                className="w-full h-[250px] md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
