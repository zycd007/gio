import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  categoryId: number;
  categoryName: string;
  name: string;
  location: string;
  year: string;
  coverImagePath?: string;
  viewCount: number;
}

const Projects = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryParam = searchParams.get('category') || '';
    setSelectedCategory(categoryParam);

    // 加载分类
    getCategories().then((data) => {
      setCategories(data);
    });

    // 加载项目
    setLoading(true);
    getProjects(1, 100, categoryParam ? undefined : undefined).then((data) => {
      setProjects(data.list);
      setLoading(false);
    });
  }, [searchParams]);

  const filteredProjects = selectedCategory
    ? projects.filter((p) => {
        const cat = categories.find((c) => c.code === selectedCategory);
        return cat && p.categoryName === cat.name;
      })
    : projects;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 页面头部 */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label">Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mt-2">
            案例作品
          </h1>
        </div>
      </section>

      {/* 分类过滤 */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 text-sm transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-4 py-2 text-sm transition-colors ${
                  selectedCategory === cat.code
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 项目列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              暂无项目数据
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={project.coverImagePath || `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80`}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-primary mb-2">{project.categoryName}</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{project.name}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">📍</span> {project.location}
                      </span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
