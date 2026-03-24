import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getProjectDetail } from '@/services/project';
import AnimatedSection from '@/components/AnimatedSection';

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

// 默认图片
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80';
const DEFAULT_THUMB = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 触摸滑动相关
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 处理键盘事件
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setIsViewerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, project]);

  // 阻止背景滚动
  useEffect(() => {
    if (isViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isViewerOpen]);

  const goToPrev = useCallback(() => {
    if (!project?.images) return;
    setViewerImageIndex((prev) => (prev === 0 ? project.images!.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [project?.images]);

  const goToNext = useCallback(() => {
    if (!project?.images) return;
    setViewerImageIndex((prev) => (prev === project.images!.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [project?.images]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // 全屏图片查看器组件
  const ImageViewer = () => {
    if (!isViewerOpen || !project?.images) return null;

    const currentImage = project.images[viewerImageIndex];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
        onClick={() => setIsViewerOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="图片查看器"
      >
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 z-10"
          style={{ color: '#fff' }}
          aria-label="关闭"
          onClick={(e) => {
            e.stopPropagation();
            setIsViewerOpen(false);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 左侧切换按钮 */}
        {project.images.length > 1 && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
            style={{ color: '#fff' }}
            aria-label="上一张"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 右侧切换按钮 */}
        {project.images.length > 1 && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
            style={{ color: '#fff' }}
            aria-label="下一张"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* 图片内容 */}
        <div
          className="max-w-[90vw] max-h-[85vh] relative"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Loading 状态 */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
            </div>
          )}
          <img
            src={getImageUrl(currentImage)}
            alt={currentImage.imageName || `图片 ${viewerImageIndex + 1}`}
            className={`max-w-full max-h-[85vh] object-contain transition-all duration-300 cursor-zoom-in ${
              isZoomed ? 'scale-150 cursor-zoom-out' : ''
            } ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ transform: isZoomed ? 'scale(1.5)' : 'scale(1)' }}
            onClick={() => setIsZoomed(!isZoomed)}
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              setIsImageLoading(false);
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: '#a0a0a0' }}>
            {viewerImageIndex + 1} / {project.images.length}
          </span>
          {/* 缩略图指示器 */}
          {project.images.length > 1 && (
            <div className="flex gap-1.5 mt-2">
              {project.images.map((_, idx) => (
                <button
                  key={idx}
                  className="w-2 h-2 rounded-full transition-all"
                  aria-label={`查看第 ${idx + 1} 张图片`}
                  style={{
                    backgroundColor: idx === viewerImageIndex ? '#d4a853' : 'rgba(255,255,255,0.3)',
                    transform: idx === viewerImageIndex ? 'scale(1.2)' : 'scale(1)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageLoading(true);
                    setViewerImageIndex(idx);
                    setIsZoomed(false);
                  }}
                />
              ))}
            </div>
          )}
          {project.images.length > 1 && (
            <span className="text-xs mt-1" style={{ color: '#666666' }}>
              左右滑动或使用 ← → 键切换，点击图片放大/缩小
            </span>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // 进入页面时滚动到顶部
    window.scrollTo(0, 0);

    if (!id) {
      setError('项目ID不存在');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getProjectDetail(parseInt(id))
      .then((data) => {
        if (!data) {
          setError('项目不存在');
          return;
        }
        setProject(data);
        // 设置默认选中图片为封面
        const coverIndex = data.images?.findIndex((img) => img.isCover === 1) ?? -1;
        setSelectedImage(coverIndex >= 0 ? coverIndex : 0);
      })
      .catch((err) => {
        console.error('Failed to load project:', err);
        setError('加载项目失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 获取当前图片URL
  const getImageUrl = (img?: ImageInfo) => {
    if (!img) return DEFAULT_IMAGE;
    return `/api/images/${img.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
          <div style={{ color: '#666666' }}>加载中...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || '项目不存在'}</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-2.5 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
            style={{ backgroundColor: '#d4a853', color: '#0a0a0a' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* 全屏图片查看器 */}
      <ImageViewer />

      {/* 项目头部 */}
      <section className="py-10 md:py-14" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          <AnimatedSection delay={100}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="text-xs md:text-sm tracking-[0.3em]" style={{ color: '#d4a853' }}>{(project.categoryNameEn || '').toUpperCase()}</span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mt-2 tracking-wide">{project.name}</h1>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-wider" style={{ color: '#666666' }}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {project.location || '-'}
                </span>
                <span>{project.year || '-'}</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {project.viewCount || 0}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 图片缩略图 */}
      {project.images && project.images.length > 0 && (
        <AnimatedSection delay={200} className="pb-10 md:pb-14">
          <div className="container mx-auto px-4">
            {/* 标题 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px" style={{ backgroundColor: '#333333' }} />
              <span className="text-xs md:text-sm tracking-widest uppercase" style={{ color: '#666666' }}>
                项目图片 {project.images.length} 张
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#333333' }} />
            </div>

            {/* 移动端：垂直网格布局 */}
            <div className="md:hidden">
              <div className="grid grid-cols-4 gap-2">
                {project.images.slice(0, 8).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setIsImageLoading(true);
                      setViewerImageIndex(index);
                      setIsViewerOpen(true);
                    }}
                    aria-label={`查看图片 ${index + 1}`}
                    className="aspect-square overflow-hidden transition-all duration-300"
                    style={{
                      border: selectedImage === index ? '2px solid #d4a853' : '2px solid transparent',
                      opacity: selectedImage === index ? 1 : 0.6
                    }}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={image.imageName || `图片 ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_THUMB;
                      }}
                    />
                  </button>
                ))}
              </div>
              {project.images.length > 8 && (
                <button
                  onClick={() => {
                    setIsImageLoading(true);
                    setViewerImageIndex(selectedImage);
                    setIsViewerOpen(true);
                  }}
                  className="w-full mt-3 py-2.5 text-xs tracking-wider transition-all duration-300"
                  style={{ border: '1px solid #1a1a1a', color: '#a0a0a0' }}
                  aria-label="查看所有图片"
                >
                  查看更多图片 ({project.images.length - 8}+)
                </button>
              )}
            </div>

            {/* 桌面端：网格布局 */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                {project.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setIsImageLoading(true);
                      setViewerImageIndex(index);
                      setIsViewerOpen(true);
                    }}
                    aria-label={`查看图片 ${index + 1}`}
                    className="aspect-[4/3] overflow-hidden transition-all duration-300 hover:opacity-90"
                    style={{
                      border: selectedImage === index ? '2px solid #d4a853' : '2px solid transparent',
                      opacity: selectedImage === index ? 1 : 0.85
                    }}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={image.imageName || `图片 ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_THUMB;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 项目详情 */}
      <AnimatedSection delay={400} className="py-10 md:py-14" style={{ backgroundColor: '#141414' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light text-white mb-6 tracking-wide">项目详情</h2>
            {project.description ? (
              <p className="leading-relaxed whitespace-pre-line text-sm md:text-base" style={{ color: '#a0a0a0' }}>{project.description}</p>
            ) : (
              <p className="italic text-sm md:text-base" style={{ color: '#666666' }}>暂无项目描述</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* 联系我们 */}
      <AnimatedSection delay={500} className="py-12 md:py-16" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-light text-white mb-4 tracking-wide">对这个项目感兴趣？</h2>
          <p className="mb-8 text-sm md:text-base" style={{ color: '#666666' }}>联系我们，获取更多项目信息和智能照明设计咨询服务</p>
          <Link to="/contact" className="btn-primary">
            联系我们
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default ProjectDetail;
