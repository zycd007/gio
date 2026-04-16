import { useState, useEffect } from 'react';

interface ImageItem {
  id: number;
  attachmentId: number;
  imageName: string;
  isCover: number;
}

interface ImageViewerProps {
  images: ImageItem[];
  currentIndex: number;
  visible: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  visible,
  onClose,
  onNavigate,
}) => {
  const [thumbnailsVisible, setThumbnailsVisible] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  // 图片切换时重置 loading 状态
  useEffect(() => {
    if (visible) {
      setImageLoading(true);
    }
  }, [currentIndex, visible]);

  // 预加载前后相邻图片
  useEffect(() => {
    if (!visible || images.length === 0) return;

    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    // 使用 Image 对象预加载相邻图片
    const preloadImages = [prevIndex, nextIndex].map(i => {
      const img = new window.Image();
      img.src = `/api/images/${images[i].id}`;
      return img;
    });

    return () => {
      // 清理预加载（可选）
      preloadImages.forEach(img => { img.src = ''; });
    };
  }, [visible, currentIndex, images]);

  // 键盘导航
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        onNavigate(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        onNavigate(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, currentIndex, images.length, onClose, onNavigate]);

  // 防止背景滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      {/* 顶部工具栏 */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white/60 text-sm font-medium">
          {currentImage.imageName || `图片 ${currentIndex + 1}`}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 主图片区域 */}
      <div
        className="flex-1 flex items-center justify-center px-16 relative min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 上一张 */}
        <button
          onClick={() => onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-full transition-all group"
        >
          <svg className="w-8 h-8 text-white/70 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 当前图片 */}
        <div className="relative w-full h-full flex items-center justify-center">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-white rounded-full"></div>
            </div>
          )}
          <img
            src={`/api/images/${currentImage.id}`}
            alt={currentImage.imageName}
            className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        {/* 下一张 */}
        <button
          onClick={() => onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-full transition-all group"
        >
          <svg className="w-8 h-8 text-white/70 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 底部缩略图导航 */}
      <div
        className="shrink-0 px-4 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 切换缩略图显示 */}
        <button
          onClick={() => setThumbnailsVisible(!thumbnailsVisible)}
          className="mb-3 text-white/50 hover:text-white text-xs flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {thumbnailsVisible ? '隐藏缩略图' : '显示缩略图'}
        </button>

        {thumbnailsVisible && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent justify-center">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => onNavigate(index)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-white/20 hover:border-white/50'
                }`}
              >
                <img
                  src={`/api/images/${img.id}`}
                  alt={img.imageName}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
