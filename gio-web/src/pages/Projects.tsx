import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getProjects } from '@/services/project';
import { useAppContext } from '@/App';
import AnimatedSection from '@/components/AnimatedSection';

interface Category {
  id: number;
  name: string;
  nameEn: string;
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
  coverImageId?: number;
  viewCount?: number;
}

const Projects = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { categories: contextCategories, projects: contextProjects, setCategories: setContextCategories, setProjects: setContextProjects } = useAppContext();

  // 监听URL参数变化，同步到selectedCategory
  useEffect(() => {
    const categoryParam = searchParams.get('category') || '';
    setSelectedCategory(categoryParam);
    // URL变化时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // 页面首次加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 加载数据 - 优先使用 Context 中的数据，避免重复请求
  useEffect(() => {
    // 如果 Context 中已有数据，直接使用
    if (contextCategories.length > 0) {
      setCategories(contextCategories);
      setProjects(contextProjects);
      setLoading(false);
      return;
    }

    // Context 中没有数据时才请求（备用方案）
    const loadData = async () => {
      try {
        const [categoriesData, projectsData] = await Promise.all([
          getCategories(),
          getProjects(1, 100)
        ]);
        setCategories(categoriesData);
        setProjects(projectsData.list);
        // 同步到 Context 供其他页面使用
        setContextCategories(categoriesData);
        setContextProjects(projectsData.list);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 使用 useMemo 缓存过滤后的项目列表
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter((p) => {
      const cat = categories.find((c) => c.code === selectedCategory);
      return cat && p.categoryName === cat.name;
    });
  }, [selectedCategory, projects, categories]);

  const handleCategoryClick = (code: string) => {
    setSelectedCategory(code);
    // 切换分类时使用平滑滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* 页面头部 */}
      <section className="py-12 md:py-14" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="section-label">Portfolio</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] text-white mt-3">
              案例作品
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* 分类过滤 - 独特设计 */}
      <section className="sticky top-[60px] left-0 right-0 z-40 py-3 backdrop-blur-md" style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-5 py-2 text-xs tracking-wider transition-all duration-300`}
              style={{
                backgroundColor: selectedCategory === '' ? '#d4a853' : 'transparent',
                color: selectedCategory === '' ? '#0a0a0a' : '#a0a0a0',
                border: '1px solid',
                borderColor: selectedCategory === '' ? '#d4a853' : '#1a1a1a'
              }}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.code)}
                className={`px-5 py-2 text-xs tracking-wider transition-all duration-300`}
                style={{
                  backgroundColor: selectedCategory === cat.code ? '#d4a853' : 'transparent',
                  color: selectedCategory === cat.code ? '#0a0a0a' : '#a0a0a0',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.code ? '#d4a853' : '#1a1a1a'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 项目列表 */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20" style={{ color: '#666666' }}>加载中...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#666666' }}>
              暂无项目数据
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 80}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="group block overflow-hidden card-hover"
                    style={{ backgroundColor: '#1a1a1a' }}
                  >
                    <div className="aspect-[4/3] md:aspect-square overflow-hidden relative">
                      <img
                        src={project.coverImageId ? `/api/images/${project.coverImageId}` : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'}
                        alt={project.name}
                        loading="lazy"
                        className="w-full h-full object-cover img-zoom-hover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] tracking-wider uppercase px-3 py-1" style={{ backgroundColor: '#d4a853', color: '#0a0a0a' }}>
                          {project.categoryName}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <h3 className="text-base md:text-lg font-light text-white mb-3 tracking-wide">{project.name}</h3>
                      <div className="flex justify-between items-center text-xs tracking-wider" style={{ color: '#666666' }}>
                        <span className="flex items-center">
                          <span className="mr-1">📍</span> {project.location}
                        </span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
