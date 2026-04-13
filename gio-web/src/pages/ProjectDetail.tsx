import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectDetail } from '@/services/project';
import AnimatedSection from '@/components/AnimatedSection';
import { usePageTrack } from '@/hooks/usePageTrack';

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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 埋点
  usePageTrack(id ? parseInt(id, 10) : undefined);

  // 触摸滑动相关
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // 图片查看器打开时，焦点锁定到关闭按钮
  useEffect(() => {
    if (isViewerOpen) {
      // 延迟聚焦，确保 DOM 已渲染
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isViewerOpen]);

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
    const newIndex = viewerImageIndex === 0 ? project.images!.length - 1 : viewerImageIndex - 1;
    setViewerImageIndex(newIndex);
    setIsImageLoading(true);
  }, [project?.images, viewerImageIndex]);

  const goToNext = useCallback(() => {
    if (!project?.images) return;
    const newIndex = viewerImageIndex === project.images!.length - 1 ? 0 : viewerImageIndex + 1;
    setViewerImageIndex(newIndex);
    setIsImageLoading(true);
  }, [project?.images, viewerImageIndex]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 30;

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
          ref={closeBtnRef}
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
          className="max-w-[90vw] max-h-[85vh] relative transition-opacity duration-200"
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsViewerOpen(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Loading 状态 */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d4a853', borderTopColor: 'transparent' }} />
            </div>
          )}
          <img
            src={getImageUrl(currentImage, true)}
            alt={currentImage.imageName || `图片 ${viewerImageIndex + 1}`}
            className={`max-w-full max-h-[85vh] object-contain transition-opacity duration-200 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => setIsViewerOpen(false)}
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
                  }}
                />
              ))}
            </div>
          )}
          {project.images.length > 1 && (
            <span className="text-xs mt-1 hidden md:block" style={{ color: '#666666' }}>
              使用 ← → 键切换，点击图片关闭
            </span>
          )}
          {project.images.length > 1 && (
            <span className="text-xs mt-1 md:hidden" style={{ color: '#666666' }}>
              左右滑动切换，点击图片关闭
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
        // 设置默认查看图片为封面
        const coverIndex = data.images?.findIndex((img) => img.isCover === 1) ?? -1;
        setViewerImageIndex(coverIndex >= 0 ? coverIndex : 0);
      })
      .catch(() => {
        setError('加载项目失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 获取当前图片URL
  // useOriginal: true 返回原图，false 返回缩略图
  const getImageUrl = (img?: ImageInfo, useOriginal: boolean = false) => {
    if (!img) return DEFAULT_IMAGE;
    return useOriginal ? `/api/images/${img.id}/file` : `/api/images/${img.id}/thumbnail`;
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
      <Helmet>
        <title>{project?.name ? `${project.name} - 光里光外 GIO` : '项目详情 - 光里光外 GIO'}</title>
        <meta name="description" content={project?.name ? `${project.name}，位于${project.location}，${project.year}年完成的专业照明设计项目` : '光里光外GIO智能照明设计案例详情'} />
        <meta name="keywords" content={`${project?.name || '照明设计'}${project?.location || ''}${project?.categoryName || ''},成都照明设计,智能照明`} />
        <link rel="canonical" href={`http://140.143.87.54/projects/${project?.id}`} />
      </Helmet>

      {/* 全屏图片查看器 */}
      <ImageViewer />

      {/* 项目头部 */}
      <section className="py-10 md:py-14" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <AnimatedSection delay={50}>
            <nav className="flex items-center gap-2 mb-6 text-xs tracking-wider">
              <Link
                to="/projects"
                className="transition-colors hover:opacity-80"
                style={{ color: '#666666' }}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                项目列表
              </Link>
              <span style={{ color: '#333333' }}>/</span>
              <span style={{ color: '#d4a853' }}>{project.name}</span>
            </nav>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="text-xs md:text-sm tracking-[0.3em]" style={{ color: '#d4a853' }}>{(project.categoryNameEn || '').toUpperCase()}</span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mt-2 tracking-wide">{project.name}</h1>
                {/* 图片总数 */}
                {project.images && project.images.length > 0 && (
                  <span className="text-xs mt-2 block" style={{ color: '#666666' }}>
                    共 {project.images.length} 张图片
                  </span>
                )}
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
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* 细分隔线 */}
        <div className="container mx-auto px-4 mt-8">
          <div className="h-px w-16" style={{ backgroundColor: '#d4a853' }} />
        </div>
      </section>

      {/* 图片缩略图 */}
      {project.images && project.images.length > 0 && (
        <AnimatedSection delay={200} className="pb-10 md:pb-14">
          <div className="container mx-auto px-4">
            {/* 移动端：垂直网格布局 */}
            <div className="md:hidden">
              <div className="grid grid-cols-3 gap-3">
                {project.images.slice(0, 8).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setIsImageLoading(true);
                      setViewerImageIndex(index);
                      setIsViewerOpen(true);
                    }}
                    aria-label={`查看图片 ${index + 1}`}
                    className="aspect-square overflow-hidden transition-all duration-300 hover:opacity-100"
                    style={{
                      opacity: 0.85
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
                    setIsViewerOpen(true);
                  }}
                  className="w-full mt-4 py-3 text-xs tracking-wider transition-all duration-300 hover:opacity-80"
                  style={{ border: '1px solid #d4a853', color: '#d4a853', backgroundColor: 'rgba(212, 168, 83, 0.05)' }}
                  aria-label="查看所有图片"
                >
                  查看更多图片 ({project.images.length - 8}+)
                </button>
              )}
            </div>

            {/* 桌面端：网格布局 */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                {project.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setIsImageLoading(true);
                      setViewerImageIndex(index);
                      setIsViewerOpen(true);
                    }}
                    aria-label={`查看图片 ${index + 1}`}
                    className="aspect-[4/3] overflow-hidden transition-all duration-300 hover:opacity-100"
                    style={{
                      opacity: 0.85
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
      {project.description && project.description.trim() && (
        <AnimatedSection delay={400} className="py-10 md:py-14" style={{ backgroundColor: '#141414' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-white mb-6 tracking-wide">项目详情</h2>
              <p className="leading-relaxed whitespace-pre-line text-sm md:text-base" style={{ color: '#a0a0a0' }}>{project.description}</p>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 联系我们 */}
      <AnimatedSection delay={500} className="py-12 md:py-16" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-light text-white mb-4 tracking-wide">
            对「{project.name}」项目感兴趣？
          </h2>
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
