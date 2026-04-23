import React, { useState, useEffect } from 'react';
import { useImageLoader } from '../../hooks/useImageLoader';
import { PLACEHOLDER_DATA_URI } from '../PlaceholderImage';

interface ResponsiveImageProps {
  imageId: number;              // 图片ID
  alt: string;                  // 图片描述
  sizes: string;                // 响应式大小规则，比如"(max-width: 768px) 400px, 800px"
  widths?: number[];            // 提供的宽度列表，默认[200, 400, 800, 1200, 1920]
  className?: string;           // 自定义样式类
  placeholder?: string;         // 占位图，默认使用低质量占位图
  priority?: 'high' | 'low';    // 加载优先级，首屏图片设为high
  loading?: 'lazy' | 'eager';   // 加载方式
  onLoad?: () => void;          // 加载完成回调
  onError?: () => void;         // 加载失败回调
}

/**
 * 响应式图片组件
 * 根据设备尺寸和分辨率自动选择最合适的图片尺寸
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageId,
  alt,
  sizes,
  widths = [200, 400, 800, 1200, 1920],
  className = '',
  placeholder = PLACEHOLDER_DATA_URI,
  priority = 'low',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcSet, setSrcSet] = useState('');
  const [src, setSrc] = useState('');

  // 生成srcset
  useEffect(() => {
    const baseUrl = `/api/images/${imageId}/file`;
    const srcSetValue = widths
      .map(width => `${baseUrl}?width=${width} ${width}w`)
      .join(', ');

    // 默认使用中间尺寸作为fallback
    const defaultWidth = widths[Math.floor(widths.length / 2)];
    const defaultSrc = `${baseUrl}?width=${defaultWidth}`;

    setSrcSet(srcSetValue);
    setSrc(defaultSrc);
  }, [imageId, widths]);

  const { loaded, error } = useImageLoader(src, { priority });

  useEffect(() => {
    if (loaded) {
      setIsLoaded(true);
      onLoad?.();
    }
    if (error) {
      onError?.();
    }
  }, [loaded, error, onLoad, onError]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 占位图 */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 实际图片 */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={priority}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />

      {/* 加载失败显示占位图 */}
      {error && (
        <img
          src={PLACEHOLDER_DATA_URI}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

/**
 * 预加载首屏关键图片
 * @param imageIds 图片ID数组
 * @param width 预加载的尺寸
 */
export function preloadCriticalImages(imageIds: number[], width = 1200) {
  if (typeof window === 'undefined') return;

  imageIds.forEach(id => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `/api/images/${id}/file?width=${width}`;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}
