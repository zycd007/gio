/**
 * 上传队列项状态
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed';

/**
 * 上传队列项
 */
export interface UploadQueueItem {
  id: string;                // 唯一标识（使用 Date.now() + index）
  file: File;                // 原始文件对象
  previewUrl: string;        // 预览 URL（File 对象生成的 blob URL）
  status: UploadStatus;      // 上传状态
  progress: number;          // 0-100 进度百分比
  error?: string;            // 失败原因（仅 failed 状态）
  resultId?: number;         // 上传成功后的 imageId（仅 success 状态）
}

/**
 * 上传回调选项
 */
export interface UploadOptions {
  onProgress?: (id: string, progress: number) => void;
  onSuccess?: (id: string, imageId: number) => void;
  onFailed?: (id: string, error: string) => void;
  onComplete?: () => void;   // 所有上传完成回调
}

/**
 * 压缩配置选项
 */
export interface CompressConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
}

/**
 * 默认压缩配置
 */
export const DEFAULT_COMPRESS_CONFIG: CompressConfig = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  maxSizeMB: 2,
};
