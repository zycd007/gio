// gio-web/src/services/uploadService.ts

import { compressImage } from '@/utils/imageCompress';
import { uploadSingleTempImage, uploadSingleProjectImage } from '@/services/admin';
import { UploadQueueItem, UploadOptions, DEFAULT_COMPRESS_CONFIG, UploadStatus } from '@/types/upload';

// AbortController 存储映射（用于取消上传）
const abortControllers: Map<string, AbortController> = new Map();

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建队列项
 */
export function createQueueItem(file: File): UploadQueueItem {
  const id = generateId();
  const previewUrl = URL.createObjectURL(file);

  return {
    id,
    file,
    previewUrl,
    status: 'pending',
    progress: 0,
  };
}

/**
 * 更新队列项状态
 */
export function updateQueueItemStatus(
  item: UploadQueueItem,
  status: UploadStatus,
  extra?: { progress?: number; error?: string; resultId?: number }
): UploadQueueItem {
  return {
    ...item,
    status,
    ...extra,
  };
}

/**
 * 压缩并上传单个图片
 */
async function compressAndUpload(
  item: UploadQueueItem,
  isTemp: boolean,
  projectId?: number,
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem> {
  // 创建 AbortController
  const controller = new AbortController();
  abortControllers.set(item.id, controller);

  try {
    // 压缩图片
    const compressedResult = await compressImage(item.file, compressConfig);
    const compressedFile = compressedResult.file;

    // 上传
    const imageId = isTemp
      ? await uploadSingleTempImage(
          compressedFile,
          (progress) => options.onProgress?.(item.id, progress),
          controller.signal
        )
      : await uploadSingleProjectImage(
          projectId!,
          compressedFile,
          (progress) => options.onProgress?.(item.id, progress),
          controller.signal
        );

    // 成功
    abortControllers.delete(item.id);
    options.onSuccess?.(item.id, imageId);
    return updateQueueItemStatus(item, 'success', { progress: 100, resultId: imageId });

  } catch (error: any) {
    abortControllers.delete(item.id);

    // 如果是取消导致的错误，不标记为失败
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      return updateQueueItemStatus(item, 'pending', { progress: 0 });
    }

    // 失败
    const errorMsg = error.message || '上传失败';
    options.onFailed?.(item.id, errorMsg);
    return updateQueueItemStatus(item, 'failed', { error: errorMsg });
  }
}

/**
 * 串行上传临时图片（新建项目场景）
 */
export async function uploadTempImagesSerial(
  items: UploadQueueItem[],
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem[]> {
  const results: UploadQueueItem[] = [...items];

  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item.status !== 'pending') continue;

    // 更新为上传中
    results[i] = updateQueueItemStatus(item, 'uploading');

    // 上传
    results[i] = await compressAndUpload(item, true, undefined, options, compressConfig);
  }

  // 所有完成
  options.onComplete?.();
  return results;
}

/**
 * 串行上传项目图片（项目详情场景）
 */
export async function uploadProjectImagesSerial(
  projectId: number,
  items: UploadQueueItem[],
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem[]> {
  const results: UploadQueueItem[] = [...items];

  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item.status !== 'pending') continue;

    // 更新为上传中
    results[i] = updateQueueItemStatus(item, 'uploading');

    // 上传
    results[i] = await compressAndUpload(item, false, projectId, options, compressConfig);
  }

  // 所有完成
  options.onComplete?.();
  return results;
}

/**
 * 取消上传
 */
export function cancelUpload(id: string): void {
  const controller = abortControllers.get(id);
  if (controller) {
    controller.abort();
    abortControllers.delete(id);
  }
}

/**
 * 重试单个失败项
 */
export async function retryUploadItem(
  item: UploadQueueItem,
  isTemp: boolean,
  projectId?: number,
  options: UploadOptions = {},
  compressConfig = DEFAULT_COMPRESS_CONFIG
): Promise<UploadQueueItem> {
  // 重置为 pending
  const resetItem = updateQueueItemStatus(item, 'pending', { progress: 0, error: undefined });

  // 重新上传
  const uploadingItem = updateQueueItemStatus(resetItem, 'uploading');
  return await compressAndUpload(uploadingItem, isTemp, projectId, options, compressConfig);
}

/**
 * 清理预览 URL（释放内存）
 */
export function cleanupPreviewUrls(items: UploadQueueItem[]): void {
  items.forEach(item => {
    if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
}