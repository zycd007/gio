// gio-web/src/components/UploadQueueCard.tsx

import { UploadQueueItem } from '@/types/upload';

interface UploadQueueCardProps {
  queue: UploadQueueItem[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onClear: () => void;
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * 状态图标
 */
function StatusIcon({ status }: { status: UploadQueueItem['status'] }) {
  switch (status) {
    case 'success':
      return (
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'failed':
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'uploading':
      return (
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      );
    case 'pending':
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * 上传队列卡片组件
 */
export default function UploadQueueCard({ queue, onCancel, onRetry, onClear }: UploadQueueCardProps) {
  if (queue.length === 0) return null;

  // 统计各状态数量
  const successCount = queue.filter(item => item.status === 'success').length;
  const failedCount = queue.filter(item => item.status === 'failed').length;
  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const uploadingCount = queue.filter(item => item.status === 'uploading').length;

  return (
    <div className="mt-3 bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* 标题栏 */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          上传队列
          <span className="ml-2 text-xs">
            ({successCount}张成功, {failedCount}张失败, {pendingCount}张等待)
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-500 transition-colors"
        >
          清空队列
        </button>
      </div>

      {/* 队列列表 */}
      <div className="max-h-48 overflow-y-auto">
        {queue.map((item) => (
          <div
            key={item.id}
            className="px-3 py-2 flex items-center gap-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
          >
            {/* 缩略图预览 */}
            <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 文件信息 */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-700 truncate">{item.file.name}</div>
              <div className="text-xs text-slate-400">{formatFileSize(item.file.size)}</div>

              {/* 失败时显示错误信息 */}
              {item.status === 'failed' && item.error && (
                <div className="text-xs text-red-500 truncate">{item.error}</div>
              )}
            </div>

            {/* 进度条 */}
            <div className="flex-shrink-0 w-20">
              {item.status === 'uploading' || item.status === 'success' ? (
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.status === 'success' ? 'bg-emerald-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-right">
                  {item.status === 'pending' ? '等待中...' : ''}
                </div>
              )}
            </div>

            {/* 状态图标 */}
            <div className="flex-shrink-0">
              <StatusIcon status={item.status} />
            </div>

            {/* 操作按钮 */}
            <div className="flex-shrink-0">
              {item.status === 'uploading' && (
                <button
                  onClick={() => onCancel(item.id)}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors px-1"
                >
                  取消
                </button>
              )}
              {item.status === 'failed' && (
                <button
                  onClick={() => onRetry(item.id)}
                  className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors px-1"
                >
                  重试
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 上传中提示 */}
      {uploadingCount > 0 && (
        <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-emerald-600">
            正在上传... 请等待完成后保存项目
          </span>
        </div>
      )}
    </div>
  );
}