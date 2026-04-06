import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProjectDetail,
  updateProject,
  uploadImages,
  deleteImage,
  setAsCover,
  getCategories,
  ProjectDetail,
} from '@/services/admin';
import { getProjectCopywritings, Copywriting } from '@/services/copywriting';
import { toast } from 'sonner';
import CopywritingModal from './components/CopywritingModal';
import CopywritingDetailModal from './components/CopywritingDetailModal';

interface Category {
  id: number;
  name: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id) : 0;

  // 页面状态
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 项目数据
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // 编辑表单数据
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    year: '',
    categoryId: 1,
    description: '',
    status: 0,
  });

  // 图片相关
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI 推文相关
  const [showCopywritingModal, setShowCopywritingModal] = useState(false);
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [loadingCopywritings, setLoadingCopywritings] = useState(false);
  const [viewingCopywriting, setViewingCopywriting] = useState<Copywriting | null>(null);
  const [showCopywritingDetailModal, setShowCopywritingDetailModal] = useState(false);

  // 确认对话框
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 加载项目详情
  useEffect(() => {
    loadProject();
  }, [projectId]);

  // 加载推文列表
  useEffect(() => {
    if (project?.id) {
      loadCopywritings();
    }
  }, [project?.id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await getProjectDetail(projectId);
      setProject(data);
      setFormData({
        name: data.name,
        location: data.location || '',
        year: data.year || '',
        categoryId: data.categoryId || 1,
        description: data.description || '',
        status: data.status || 0,
      });
    } catch (err: any) {
      toast.error('加载项目失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err: any) {
      // 加载分类失败
    }
  };

  const loadCopywritings = async () => {
    if (!project?.id) return;
    setLoadingCopywritings(true);
    try {
      const data = await getProjectCopywritings(project.id);
      setCopywritings(data || []);
    } catch (err: any) {
      toast.error('加载推文失败：' + err.message);
    } finally {
      setLoadingCopywritings(false);
    }
  };

  // 进入编辑模式
  const handleEnterEditMode = () => {
    if (!project) return;
    loadCategories();
    setEditMode(true);
  };

  // 退出编辑模式
  const handleExitEditMode = () => {
    if (project) {
      // 恢复原始数据
      setFormData({
        name: project.name,
        location: project.location || '',
        year: project.year || '',
        categoryId: project.categoryId || 1,
        description: project.description || '',
        status: project.status || 0,
      });
    }
    setEditMode(false);
  };

  // 保存项目
  const handleSave = async () => {
    if (!project) return;

    // 校验
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
      await updateProject(project.id, formData);
      toast.success('保存成功');
      setEditMode(false);
      loadProject();
    } catch (err: any) {
      toast.error('保存失败：' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await uploadImages(projectId, Array.from(files));
      toast.success('图片上传成功');
      loadProject();
    } catch (err: any) {
      toast.error('上传失败：' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 删除图片
  const handleDeleteImage = (imageId: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这张图片吗？',
      onConfirm: async () => {
        try {
          await deleteImage(imageId);
          toast.success('图片已删除');
          loadProject();
        } catch (err: any) {
          toast.error('删除失败：' + err.message);
        }
        setConfirmConfig(null);
      },
    });
  };

  // 设为封面
  const handleSetCover = async (imageId: number) => {
    try {
      await setAsCover(imageId);
      toast.success('封面设置成功');
      loadProject();
    } catch (err: any) {
      toast.error('设置封面失败：' + err.message);
    }
  };

  // 获取封面图
  const getCoverImage = () => {
    if (!project?.images?.length) return null;
    return project.images.find((img) => img.isCover === 1) || project.images[0];
  };

  // 复制项目描述
  const handleCopyDescription = async () => {
    if (!formData.description) {
      toast.error('暂无描述内容');
      return;
    }
    try {
      await navigator.clipboard.writeText(formData.description);
      toast.success('已复制描述');
    } catch (err) {
      toast.error('复制失败');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">项目不存在</p>
          <button
            onClick={() => navigate('/admin/projects')}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl"
          >
            返回项目列表
          </button>
        </div>
      </div>
    );
  }

  const coverImage = getCoverImage();

  return (
    <div className="min-h-full bg-slate-50/50">
      {/* 顶部导航栏 */}
      <div
        className={`sticky top-0 z-10 border-b ${
          editMode ? 'bg-blue-50/80 border-blue-200' : 'bg-white/80 border-slate-200'
        } backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/projects')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xl font-semibold text-slate-800 bg-transparent border-b-2 border-transparent focus:border-emerald-500 outline-none px-1"
              />
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-slate-800">{project.name}</h1>
                <p className="text-xs text-slate-500">ID: {project.id}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleExitEditMode}
                  disabled={saving}
                  className="px-5 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  保存
                </button>
              </>
            ) : (
              <button
                onClick={handleEnterEditMode}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：图片区 (5 列) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            {/* 封面大图 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                {coverImage ? (
                  <img
                    src={`/api/images/${coverImage.id}?t=${Date.now()}`}
                    alt={coverImage.imageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* 缩略图网格 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">项目图片</h3>
                {editMode && (
                  <label className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-xs cursor-pointer flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    上传
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {project.images.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  暂无图片
                  {editMode && <span className="ml-1">，点击上方上传图片</span>}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {project.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                    >
                      <img
                        src={`/api/images/${img.id}?t=${Date.now()}`}
                        alt={img.imageName}
                        className="w-full h-full object-cover"
                      />
                      {img.isCover === 1 && (
                        <span className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          封面
                        </span>
                      )}
                      {editMode && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {img.isCover !== 1 && (
                            <button
                              onClick={() => handleSetCover(img.id)}
                              className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                              title="设为封面"
                            >
                              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
                            title="删除"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：信息区 (7 列) */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  基本信息
                </h3>
              </div>

              <div className="space-y-4">
                {/* 分类 */}
                <div>
                  <label className="text-sm text-slate-500 mb-1 block">项目分类</label>
                  {editMode ? (
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-slate-800 font-medium">{project.categoryName}</div>
                  )}
                </div>

                {/* 位置和年份 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">项目位置</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                        placeholder="例如：上海、北京"
                      />
                    ) : (
                      <div className="text-slate-800 font-medium">{project.location || '-'}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">设计年份</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                        placeholder="例如：2024"
                      />
                    ) : (
                      <div className="text-slate-800 font-medium">{project.year || '-'}</div>
                    )}
                  </div>
                </div>

                {/* 状态 */}
                <div>
                  <label className="text-sm text-slate-500 mb-2 block">发布状态</label>
                  {editMode ? (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 0}
                          onChange={() => setFormData({ ...formData, status: 0 })}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <span className="text-sm text-slate-600">草稿</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 1}
                          onChange={() => setFormData({ ...formData, status: 1 })}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <span className="text-sm text-slate-600">已发布</span>
                      </label>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 1
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {project.status === 1 ? '已发布' : '草稿'}
                    </span>
                  )}
                </div>

                {/* 项目描述 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-slate-500">项目描述</label>
                    {editMode && (
                      <button
                        onClick={handleCopyDescription}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        复制
                      </button>
                    )}
                  </div>
                  {editMode ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none text-sm leading-relaxed"
                      rows={5}
                      placeholder="请输入项目描述..."
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {project.description || '暂无描述'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI 推文管理卡片 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  AI 推文
                  <span className="text-xs text-slate-400 font-normal">({copywritings.length}条)</span>
                </h3>
                <button
                  onClick={() => setShowCopywritingModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  生成推文
                </button>
              </div>

              {loadingCopywritings ? (
                <div className="text-center py-8 text-slate-400">加载中...</div>
              ) : copywritings.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-8 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <p className="text-slate-500 text-sm">暂无关联推文</p>
                  <p className="text-slate-400 text-xs mt-1">点击右上角"生成推文"创建第一条推文</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {copywritings.map((cw) => (
                    <div
                      key={cw.id}
                      className="border border-slate-200 rounded-xl p-3 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-800 truncate">{cw.title}</h4>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                cw.status === 1
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {cw.status === 1 ? '已发布' : '草稿'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs line-clamp-2">{cw.content}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setViewingCopywriting(cw);
                              setShowCopywritingDetailModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="查看"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI 文案生成弹窗 - 传入当前项目 ID，直接从该项目生成 */}
      <CopywritingModal
        copywriting={null}
        visible={showCopywritingModal}
        onClose={() => setShowCopywritingModal(false)}
        onSaveSuccess={() => {
          setShowCopywritingModal(false);
          loadCopywritings();
          toast.success('推文已保存');
        }}
        projectId={project.id}
        projectName={project.name}
      />

      {/* 推文详情弹窗 */}
      {showCopywritingDetailModal && viewingCopywriting && (
        <CopywritingDetailModal
          copywriting={viewingCopywriting}
          visible={showCopywritingDetailModal}
          onClose={() => {
            setShowCopywritingDetailModal(false);
            setViewingCopywriting(null);
          }}
        />
      )}

      {/* 确认对话框 */}
      {confirmConfig?.show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmConfig(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{confirmConfig.title}</h3>
            <p className="text-slate-600 mb-6">{confirmConfig.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmConfig(null)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
