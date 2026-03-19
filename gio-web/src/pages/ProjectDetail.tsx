import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetail } from '@/services/project';

interface ImageInfo {
  id: number;
  imagePath: string;
  imageName: string;
  width: number;
  height: number;
  fileSize: number;
  isCover: number;
}

interface ProjectDetail {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryNameEn: string;
  name: string;
  location: string;
  year: string;
  description?: string;
  coverImageId?: number;
  sortOrder: number;
  viewCount: number;
  images: ImageInfo[];
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
          const coverIndex = data.images.findIndex((img) => img.isCover === 1);
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
      <section className="bg-dark py-12">
        <div className="container mx-auto px-4">
          <Link to="/projects" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
            ← 返回项目列表
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-primary text-sm tracking-wider">{project.categoryNameEn}</span>
              <h1 className="text-3xl md:text-4xl font-light text-white mt-2">{project.name}</h1>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0 text-gray-400 text-sm">
              <span>📍 {project.location}</span>
              <span>{project.year}</span>
              <span>浏览：{project.viewCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 主图展示 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="aspect-[16/10] bg-white overflow-hidden shadow-lg">
            <img
              src={project.images[selectedImage]?.imagePath || ''}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* 图片缩略图 */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-4">
            {project.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-32 h-24 overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image.imagePath || ''}
                  alt={image.imageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 项目详情 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-gray-800 mb-6">项目详情</h2>
            {project.description ? (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.description}</p>
            ) : (
              <p className="text-gray-400 italic">暂无项目描述</p>
            )}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-12 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4">对这个项目感兴趣？</h2>
          <p className="text-gray-400 mb-8">联系我们，获取更多项目信息和设计咨询服务</p>
          <Link to="/contact" className="btn-primary inline-block">
            联系我们
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
