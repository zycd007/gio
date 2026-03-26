interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className = '', style }: SkeletonProps) => (
  <div
    className={`animate-shimmer ${className}`}
    style={{ backgroundColor: '#1a1a1a', ...style }}
  />
);

// 项目卡片骨架屏
export const ProjectCardSkeleton = () => (
  <div
    className="overflow-hidden card-hover"
    style={{ backgroundColor: '#1a1a1a' }}
  >
    <div className="aspect-[4/3] md:aspect-square overflow-hidden relative">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-5 md:p-6">
      <Skeleton className="h-6 w-3/4 mb-3 rounded" style={{ height: '1.5rem' }} />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24 rounded" style={{ height: '0.75rem', width: '6rem' }} />
        <Skeleton className="h-4 w-12 rounded" style={{ height: '0.75rem', width: '3rem' }} />
      </div>
    </div>
  </div>
);

// 分类卡片骨架屏
export const CategoryCardSkeleton = () => (
  <div
    className="p-4 md:p-6 text-center transition-all duration-300 card-hover"
    style={{ backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a' }}
  >
    <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" style={{ width: '3rem', height: '3rem' }} />
    <Skeleton className="h-5 w-20 mx-auto mb-2 rounded" style={{ height: '1.25rem', width: '5rem' }} />
    <Skeleton className="h-3 w-16 mx-auto rounded" style={{ height: '0.75rem', width: '4rem' }} />
  </div>
);

export default Skeleton;