import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  createProject,
  uploadTempImages,
  associateImagesToProject,
  getCategories,
} from '@/services/admin';
import { compressImages } from '@/utils/imageCompress';

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
  const [uploading, setUploading] = useState(false);
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

  // 暂存的临时图片
  const [pendingTempImageIds, setPendingTempImageIds] = useState<number[]>([]);
  const [pendingImageFiles, setPendingImageFiles] = useState<{ id: number; file: File }[]>([]);

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
    setPendingTempImageIds([]);
    setPendingImageFiles([]);
  };

  // 上传临时图片
  const handleUploadTempImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // 前端压缩
      const compressResults = await compressImages(Array.from(files), {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        maxSizeMB: 2,
      });

      // 显示压缩提示
      const compressedCount = compressResults.filter(r => r.wasCompressed).length;
      if (compressedCount > 0) {
        const savedSize = compressResults.reduce((acc, r) =>
          acc + (r.originalSize - r.compressedSize), 0);
        const savedMB = (savedSize / 1024 / 1024).toFixed(1);
        toast.info(`已压缩 ${compressedCount} 张图片，节省 ${savedMB}MB`);
      }

      // 上传压缩后的文件
      const compressedFiles = compressResults.map(r => r.file);
      const tempImageIds = await uploadTempImages(compressedFiles);
      setPendingTempImageIds(prev => [...prev, ...tempImageIds]);

      // 使用原始文件用于预览
      const newPreviewFiles = Array.from(files).map((file, index) => ({
        id: tempImageIds[index],
        file,
      }));
      setPendingImageFiles(prev => [...prev, ...newPreviewFiles]);
    } catch (err: any) {
      toast.error('上传失败：' + err.message);
    } finally {
      setUploading(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 移除暂存的图片
  const handleRemovePendingImage = (imageId: number) => {
    setPendingTempImageIds(prev => prev.filter(id => id !== imageId));
    setPendingImageFiles(prev => prev.filter(item => item.id !== imageId));
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

      // 关联图片
      if (pendingTempImageIds.length > 0) {
        try {
          await associateImagesToProject(newProject.id, pendingTempImageIds);
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

          {/* 项目图片 - 3排网格布局 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">项目图片</label>
            <div
              className="relative border border-slate-200 rounded-lg p-3 bg-slate-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
              style={{ maxHeight: '264px', overflowY: 'auto' }}
            >
              <div className="grid grid-cols-5 gap-2">
                {/* 上传按钮 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                >
                  {uploading ? (
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
                  onChange={handleUploadTempImages}
                  className="hidden"
                  disabled={uploading}
                />

                {/* 已上传的图片列表 */}
                {pendingImageFiles.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group"
                  >
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.startsWith('blob:')) {
                          URL.revokeObjectURL(target.src);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleRemovePendingImage(item.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="移除"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* 图片数量提示 */}
              {pendingImageFiles.length > 0 && (
                <div className="mt-2 text-xs text-slate-500 text-center">
                  已上传 {pendingImageFiles.length} 张图片
                </div>
              )}
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
            disabled={saving}
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