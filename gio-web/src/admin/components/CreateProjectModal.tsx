import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  createProject,
  associateImagesToProject,
  getCategories,
} from '@/services/admin';
import UploadQueueCard from '@/components/UploadQueueCard';
import {
  createQueueItem,
  uploadTempImagesSerial,
  cancelUpload,
  retryUploadItem,
  cleanupPreviewUrls,
} from '@/services/uploadService';
import { UploadQueueItem } from '@/types/upload';

interface Category {
  id: number;
  name: string;
}

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal = ({ visible, onClose, onSuccess }: CreateProjectModalProps) => {
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    year: '',
    categoryId: 1,
    description: '',
    status: 0,  // 默认为草稿状态（未发布）
  });

  // 上传队列
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageIds, setUploadedImageIds] = useState<number[]>([]);

  // 加载分类
  useEffect(() => {
    if (visible) {
      getCategories().then((data) => {
        setCategories(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      });
    }
  }, [visible]);

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      year: '',
      categoryId: categories.length > 0 ? categories[0].id : 1,
      description: '',
      status: 0,  // 保持草稿状态
    });
    cleanupPreviewUrls(uploadQueue);
    setUploadQueue([]);
    setUploadedImageIds([]);
    setIsUploading(false);
  };

  // 选择文件并开始上传
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems = Array.from(files).map(file => createQueueItem(file));
    setUploadQueue(prev => [...prev, ...newItems]);
    setIsUploading(true);

    const updatedQueue = await uploadTempImagesSerial([...uploadQueue, ...newItems], {
      onProgress: (id, progress) => {
        setUploadQueue(prev => prev.map(item => item.id === id ? { ...item, progress } : item));
      },
      onSuccess: (_id, imageId) => {
        setUploadedImageIds(prev => [...prev, imageId]);
      },
      onFailed: (_id, error) => {
        toast.error(`上传失败: ${error}`);
      },
      onComplete: () => {
        setIsUploading(false);
        toast.success('所有图片上传完成');
      },
    });

    setUploadQueue(updatedQueue);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 取消上传
  const handleCancelUpload = (id: string) => {
    cancelUpload(id);
    setUploadQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'pending', progress: 0 } : item));
  };

  // 重试上传
  const handleRetryUpload = async (id: string) => {
    const item = uploadQueue.find(i => i.id === id);
    if (!item || item.status !== 'failed') return;

    setIsUploading(true);
    const updatedItem = await retryUploadItem(item, true, undefined, {
      onProgress: (progressId, progress) => {
        setUploadQueue(prev => prev.map(i => i.id === progressId ? { ...i, progress } : i));
      },
      onSuccess: (_successId, imageId) => {
        setUploadedImageIds(prev => [...prev, imageId]);
      },
      onFailed: (_failedId, error) => {
        toast.error(`重试失败: ${error}`);
      },
    });

    setUploadQueue(prev => prev.map(i => i.id === id ? updatedItem : i));
    setIsUploading(false);
  };

  // 清空队列
  const handleClearQueue = () => {
    cleanupPreviewUrls(uploadQueue);
    setUploadQueue([]);
    setUploadedImageIds([]);
  };

  // 保存项目
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('请输入项目名称');
      return;
    }
    if (!formData.year) {
      toast.error('请输入项目年份');
      return;
    }

    setSaving(true);
    try {
      const newProject = await createProject(formData);

      const successfulIds = uploadQueue
        .filter(item => item.status === 'success' && item.resultId)
        .map(item => item.resultId!);

      const allImageIds = [...new Set([...uploadedImageIds, ...successfulIds])];

      if (allImageIds.length > 0) {
        try {
          await associateImagesToProject(newProject.id, allImageIds);
        } catch (err: any) {
          toast.error('图片关联失败：' + err.message);
        }
      }

      toast.success('项目创建成功');
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('创建失败：' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">新建项目</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* 分类 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">项目分类</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* 名称 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">项目名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 outline-none"
              placeholder="请输入项目名称"
            />
          </div>

          {/* 位置和年份 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">项目位置</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 outline-none"
                placeholder="例如：上海"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">设计年份 *</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 outline-none"
                placeholder="例如：2024"
              />
            </div>
          </div>

          {/* 项目图片 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">项目图片</label>
            <div className="relative border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex-shrink-0"
                >
                  {isUploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                {uploadQueue.filter(item => item.status === 'success').length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {uploadQueue.filter(item => item.status === 'success').slice(0, 8).map((item) => (
                      <div key={item.id} className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {uploadQueue.filter(item => item.status === 'success').length > 8 && (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500 flex-shrink-0">
                        +{uploadQueue.filter(item => item.status === 'success').length - 8}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <UploadQueueCard
                queue={uploadQueue}
                onCancel={handleCancelUpload}
                onRetry={handleRetryUpload}
                onClear={handleClearQueue}
              />
            </div>
          </div>

          {/* 项目描述 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">项目描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 outline-none resize-none"
              rows={4}
              placeholder="请输入项目描述"
            />
          </div>
        </div>

        {/* 底部按钮 - 右下角 */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={saving}
            className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isUploading}
            className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            创建
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;