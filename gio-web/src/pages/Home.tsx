import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProjects } from '@/services/project';

interface Category {
  id: number;
  name: string;
  name_en: string;
  code: string;
  icon: string;
  sortOrder: number;
}

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  coverImagePath?: string;
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
      <section className="relative h-[600px] bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
          alt="Hero"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-primary text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
              Design Excellence Since 2010
            </p>
            <h1 className="text-4xl md:text-6xl font-light tracking-widest mb-6">
              GIO&SJ 设计事务所
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
              专注于高端私宅、餐饮空间、娱乐空间的室内设计
            </p>
            <Link to="/projects" className="inline-block mt-10 btn-primary">
              探索作品
            </Link>
          </div>
        </div>
      </section>

      {/* 分类预览 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="section-label">Our Expertise</span>
            <h2 className="section-title text-3xl md:text-4xl mt-2">专业领域</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects?category=${cat.code}`}
                className="group text-center p-6 border border-gray-100 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{cat.name_en}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选作品 */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="section-label">Featured Works</span>
            <h2 className="section-title text-3xl md:text-4xl mt-2">精选作品</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.coverImagePath || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{project.name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/projects" className="btn-primary inline-block">
              查看更多作品
            </Link>
          </div>
        </div>
      </section>

      {/* 关于我们简介 */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <span className="section-label">About Us</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-widest mt-2 mb-8">
                关于 GIO&SJ
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                GIO&SJ 设计事务所成立于 2010 年，是一家专注于高端室内设计的知名事务所。
                我们的团队由经验丰富的设计师组成，致力于为客户创造独特而富有灵感的空间。
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                我们相信设计不仅仅是美学，更是对生活方式的理解和诠释。
                每一个项目都是独一无二的，我们用心倾听客户的需求，将他们的愿景转化为现实。
              </p>
              <Link to="/about" className="text-primary hover:text-white transition-colors inline-flex items-center">
                了解更多
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="About"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
