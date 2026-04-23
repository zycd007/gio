import { useState, useEffect } from 'react';

interface UseImageLoaderOptions {
  maxRetries?: number;        // 最大重试次数，默认3次
  retryDelay?: number;        // 重试延迟（毫秒），默认1000ms
  priority?: 'high' | 'low';  // 加载优先级
  crossOrigin?: string;       // 跨域设置
}

interface UseImageLoaderResult {
  loaded: boolean;            // 是否加载完成
  error: boolean;             // 是否加载失败
  retries: number;            // 已重试次数
  load: (src: string) => void;// 手动触发加载
}

/**
 * 图片加载Hook，支持重试、错误处理
 */
export function useImageLoader(
  src?: string,
  options: UseImageLoaderOptions = {}
): UseImageLoaderResult {
  const { maxRetries = 3, retryDelay = 1000, priority = 'low', crossOrigin } = options;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retries, setRetries] = useState(0);

  const load = (imageSrc: string) => {
    if (!imageSrc) return;

    setLoaded(false);
    setError(false);

    const img = new Image();

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    // 设置优先级（Chrome支持）
    if (priority === 'high' && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high';
    }

    img.onload = () => {
      setLoaded(true);
      setError(false);
    };

    img.onerror = () => {
      if (retries < maxRetries) {
        // 指数退避重试
        const delay = retryDelay * Math.pow(2, retries);
        setTimeout(() => {
          setRetries(prev => prev + 1);
          img.src = `${imageSrc}?t=${Date.now()}`; // 加时间戳避免缓存
        }, delay);
      } else {
        setError(true);
        setLoaded(false);
      }
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    if (src) {
      load(src);
    }
  }, [src, retries]);

  return { loaded, error, retries, load };
}

// 全局图片加载队列，控制并发数
class ImageLoaderQueue {
  private queue: Array<{ src: string; resolve: () => void; reject: (error: Error) => void }> = [];
  private active = 0;
  private concurrency = 3; // 最多同时加载3张图片

  load(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ src, resolve, reject });
      this.processNext();
    });
  }

  private processNext() {
    if (this.active >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift()!;
    this.active++;

    const img = new Image();
    img.onload = () => {
      task.resolve();
      this.active--;
      this.processNext();
    };
    img.onerror = () => {
      task.reject(new Error(`图片加载失败: ${task.src}`));
      this.active--;
      this.processNext();
    };
    img.src = task.src;
  }

  // 设置并发数
  setConcurrency(concurrency: number) {
    this.concurrency = concurrency;
  }

  // 清空队列
  clear() {
    this.queue = [];
  }
}

export const imageLoaderQueue = new ImageLoaderQueue();

/**
 * 批量加载图片，控制并发
 */
export async function batchLoadImages(urls: string[], concurrency = 3): Promise<string[]> {
  const results: string[] = [];
  const queue = [...urls];
  let active = 0;

  return new Promise((resolve) => {
    function next() {
      if (active < concurrency && queue.length > 0) {
        const url = queue.shift()!;
        active++;

        const img = new Image();
        img.onload = () => {
          results.push(url);
          active--;
          next();
        };
        img.onerror = () => {
          results.push(url); // 失败也继续，不阻塞
          active--;
          next();
        };
        img.src = url;
      } else if (active === 0 && queue.length === 0) {
        resolve(results);
      }
    }

    next();
  });
}
