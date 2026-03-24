import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetail } from '@/services/project';

interface ImageInfo {
  id: number;
  attachmentId?: number;
  imageName?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  isCover?: number;
}

interface ProjectDetail {
  id: number;
  categoryId?: number;
  categoryName?: string;
  categoryNameEn?: string;
  name: string;
  location?: string;
  year?: string;
  description?: string;
  coverImageId?: number;
  sortOrder?: number;
  viewCount?: number;
  images?: ImageInfo[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProjectDetail(parseInt(id))
        .then((data) => {
          setProject(data);
          // 设置默认选中图片为封面
          const coverIndex = data.images?.findIndex((img) => img.isCover === 1) ?? 0;
          setSelectedImage(coverIndex >= 0 ? coverIndex : 0);
        })
        .catch((err) => {
          console.error('Failed to load project:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600 mb-4">项目不存在</h1>
          <Link to="/projects" className="text-primary hover:underline">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 项目头部 */}
      <section className="bg-dark py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link to="/projects" className="text-gray-400 hover:text-white text-sm mb-3 md:mb-4 inline-flex items-center active:opacity-70 transition-opacity">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回项目列表
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <span className="text-primary text-xs md:text-sm tracking-wider">{project.categoryNameEn || ''}</span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mt-1 md:mt-2">{project.name}</h1>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-400 text-xs md:text-sm">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {project.location || ''}
              </span>
              <span>{project.year || ''}</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {project.viewCount || 0}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 主图展示 */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="aspect-[4/3] md:aspect-[16/10] bg-white overflow-hidden shadow-lg">
            <img
              src={project.images?.[selectedImage] ? `/api/images/${project.images[selectedImage].id}` : ''}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* 图片缩略图 - 移动端垂直滚动，桌面端水平滚动 */}
      <section className="pb-8 md:pb-12">
        <div className="container mx-auto px-4">
          {/* 移动端：垂直网格布局 */}
          <div className="md:hidden">
            <div className="grid grid-cols-4 gap-2">
              {project.images?.slice(0, 8).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={`/api/images/${image.id}`}
                    alt={image.imageName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
            {project.images && project.images.length > 8 && (
              <button
                onClick={() => {
                  // 滚动到更多图片或展开
                  const nextIndex = selectedImage + 1 < project.images!.length ? selectedImage + 1 : 0;
                  setSelectedImage(nextIndex);
                }}
                className="w-full mt-3 py-2 text-sm text-primary border border-primary/30 rounded-sm active:bg-primary/10 transition-colors"
              >
                查看更多图片
              </button>
            )}
          </div>

          {/* 桌面端：水平滚动 */}
          <div className="hidden md:block">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {project.images?.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-32 h-24 overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={`/api/images/${image.id}`}
                    alt={image.imageName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 项目详情 */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-4 md:mb-6">项目详情</h2>
            {project.description ? (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">{project.description}</p>
            ) : (
              <p className="text-gray-400 italic text-sm md:text-base">暂无项目描述</p>
            )}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-8 md:py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-light mb-3 md:mb-4">对这个项目感兴趣？</h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">联系我们，获取更多项目信息和智能照明设计咨询服务</p>
          <Link to="/contact" className="btn-primary inline-block active:scale-95 transition-transform">
            联系我们
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
