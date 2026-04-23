/**
 * 图片压缩工具
 * 使用 Canvas API 实现前端图片压缩
 */

interface CompressOptions {
  maxWidth?: number;      // 最大宽度，默认 1920
  maxHeight?: number;     // 最大高度，默认 1080
  quality?: number;       // 压缩质量，默认 0.85
  maxSizeMB?: number;     // 最大文件大小（MB），超过此值强制压缩
  preferWebP?: boolean;   // 优先使用WebP格式，默认true
}

// 检测浏览器是否支持WebP
let supportsWebP: boolean | null = null;

export function checkWebPSupport(): Promise<boolean> {
  if (supportsWebP !== null) {
    return Promise.resolve(supportsWebP);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      supportsWebP = img.width === 1;
      resolve(supportsWebP);
    };
    img.onerror = () => {
      supportsWebP = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';
  });
}

interface CompressResult {
  file: File;             // 压缩后的文件
  originalSize: number;   // 原始文件大小
  compressedSize: number; // 压缩后文件大小
  wasCompressed: boolean; // 是否进行了压缩
}

/**
 * 压缩图片文件
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    maxSizeMB = 2,  // 超过 2MB 的图片需要压缩
    preferWebP = true,
  } = options;

  const originalSize = file.size;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // 判断是否需要压缩
  const needsCompress = originalSize > maxSizeBytes;

  // 检查WebP支持
  const webPSupported = preferWebP ? await checkWebPSupport() : false;
  const outputFormat = webPSupported ? 'image/webp' : 'image/jpeg';
  const fileExtension = webPSupported ? '.webp' : '.jpg';

  if (!needsCompress) {
    // 如果原始文件已经是WebP格式，直接返回
    if (file.type === 'image/webp' || !webPSupported) {
      return {
        file,
        originalSize,
        compressedSize: originalSize,
        wasCompressed: false,
      };
    }
    // 否则将非WebP格式转换为WebP以获得更好的压缩率
  }

  // 读取图片
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // 计算缩放比例
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // 创建 Canvas 并绘制压缩后的图片
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 创建新的 File 对象
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, fileExtension), {
              type: outputFormat,
              lastModified: Date.now(),
            });
            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: compressedFile.size,
              wasCompressed: true,
            });
          } else {
            reject(new Error('Canvas toBlob 失败'));
          }
        },
        outputFormat,
        quality
      );
    };
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 批量压缩图片
 */
export async function compressImages(
  files: File[],
  options: CompressOptions = {}
): Promise<CompressResult[]> {
  const results: CompressResult[] = [];

  for (const file of files) {
    try {
      const result = await compressImage(file, options);
      results.push(result);
    } catch (error) {
      // 压缩失败时返回原始文件
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        wasCompressed: false,
      });
    }
  }

  return results;
}