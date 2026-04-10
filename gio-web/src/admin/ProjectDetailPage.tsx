import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProjectDetail,
  updateProject,
  uploadImages,
  uploadTempImages,
  associateImagesToProject,
  deleteImage,
  setAsCover,
  getCategories,
  updateImageSortOrder,
  deleteProject,
  updateProjectStatus,
  setProjectFeatured,
  createProject,
  ProjectDetail,
  ProjectImage,
} from '@/services/admin';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageViewer from './components/ImageViewer';
import { compressImages } from '@/utils/imageCompress';

interface Category {
  id: number;
  name: string;
}

// 可拖拽的图片项组件
const SortableImageItem = ({
  image,
  onClick,
  onSetCover,
  onDelete,
  isEditMode,
}: {
  image: ProjectImage;
  onClick: () => void;
  onSetCover: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`relative aspect-square rounded-xl overflow-hidden ${isEditMode ? 'cursor-move' : 'cursor-pointer'} group border-2 border-transparent hover:border-emerald-400 transition-all ${isDragging ? 'border-emerald-500 shadow-lg' : ''}`}
    >
      <img
        src={`/api/images/${image.id}?t=${Date.now()}`}
        alt={image.imageName}
        className="w-full h-full object-cover pointer-events-none"
      />
      {image.isCover === 1 && (
        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium shadow-sm">
          封面
        </span>
      )}
      {/* 拖拽手柄提示 */}
      {isEditMode && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4h4v2h-4V4zm0 14h4v2h-4v-2zM4 10h2v4H4v-4zm14 0h2v4h-2v-4zM6.59 6.59L8 8l-1.41 1.41L5.17 8 6.59 6.59zm10.82 10.82L18.83 16l1.41 1.41L18.83 18.83l-1.42-1.42zM6.59 17.41L8 16l-1.41-1.41L5.17 16l1.42 1.41zm10.82-10.82L18.83 8l-1.41-1.41L18.83 5.17l1.42 1.42z"/>
          </svg>
        </div>
      )}
      {/* 悬浮层显示操作提示 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
        </svg>
      </div>
      {/* 编辑模式下的操作按钮 */}
      {isEditMode && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onSetCover}
            className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
            title="设为封面"
          >
            <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
            title="删除"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

interface Category {
  id: number;
  name: string;
}

// 页面模式
type PageMode = 'viewMode' | 'editMode' | 'createMode';


const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewProject = id === 'new';
  const projectId = isNewProject ? 0 : (id ? parseInt(id) : 0);

  // 页面模式
  const [pageMode, setPageMode] = useState<PageMode>(isNewProject ? 'createMode' : 'viewMode');

  // 页面状态
  const [loading, setLoading] = useState(!isNewProject);
  const [saving, setSaving] = useState(false);

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
    status: 0,  // 默认为草稿状态（未发布）
    isFeatured: 0,
  });

  // 新建项目时暂存的临时图片 ID 列表
  const [pendingTempImageIds, setPendingTempImageIds] = useState<number[]>([]);
  // 新建项目时暂存的图片文件（用于预览）
  const [pendingImageFiles, setPendingImageFiles] = useState<{ id: number; file: File }[]>([]);

  // 图片相关
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 图片查看器状态
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  // 确认对话框
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 加载分类（新建和编辑都需要）
  useEffect(() => {
    loadCategories();
  }, []);

  // 加载项目详情
  useEffect(() => {
    if (!isNewProject && projectId) {
      loadProject();
    }
  }, [projectId, isNewProject]);

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
        status: data.status ?? 1,
        isFeatured: data.isFeatured ?? 0,
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
      // 新建项目时设置默认分类
      if (isNewProject && data && data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (err: any) {
      // 加载分类失败
    }
  };

  // 进入编辑模式
  const handleEnterEditMode = () => {
    if (!project) return;
    loadCategories();
    setPageMode('editMode');
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
        status: project.status ?? 1,
        isFeatured: project.isFeatured ?? 0,
      });
    }
    setPageMode('viewMode');
  };

  // 保存项目
  const handleSave = async () => {
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
      if (isNewProject) {
        // 新建项目
        const newProject = await createProject(formData);

        // 如果有暂存的临时图片，关联到新项目
        if (pendingTempImageIds.length > 0) {
          try {
            await associateImagesToProject(newProject.id, pendingTempImageIds);
          } catch (err: any) {
            toast.error('图片关联失败：' + err.message);
          }
        }

        // 返回项目列表页面
        toast.success('项目创建成功');
        navigate('/admin/projects');
      } else if (project) {
        // 更新项目
        await updateProject(project.id, formData);
        toast.success('保存成功');
        setPageMode('viewMode');
        loadProject();
      }
    } catch (err: any) {
      toast.error('保存失败：' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 图片上传（现有项目）
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 检查是否有有效的项目 ID
    if (!projectId || projectId <= 0) {
      toast.error('请先保存项目后再上传图片');
      return;
    }

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
      await uploadImages(projectId, compressedFiles);
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

  // 新建项目时上传临时图片
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

      // 更新暂存的图片 ID 列表
      setPendingTempImageIds(prev => [...prev, ...tempImageIds]);

      // 使用原始文件用于预览
      const newPreviewFiles = Array.from(files).map((file, index) => ({
        id: tempImageIds[index],
        file,
      }));
      setPendingImageFiles(prev => [...prev, ...newPreviewFiles]);

      toast.success(`已上传 ${files.length} 张图片`);
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
    toast.success('已移除图片');
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

  // 拖拽排序配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 拖拽结束处理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !project) return;

    const oldIndex = project.images.findIndex((img) => img.id === active.id);
    const newIndex = project.images.findIndex((img) => img.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // 重新排序图片列表
    const newImages = [...project.images];
    const [movedImage] = newImages.splice(oldIndex, 1);
    newImages.splice(newIndex, 0, movedImage);

    // 更新本地状态
    setProject({ ...project, images: newImages });

    // 调用 API 保存排序
    try {
      const sortList = newImages.map((img, index) => ({
        imageId: img.id,
        sortOrder: index,
      }));
      await updateImageSortOrder(project.id, sortList);
      toast.success('排序已保存');
    } catch (err: any) {
      toast.error('保存排序失败：' + err.message);
      // 恢复原顺序
      loadProject();
    }
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

  // 打开图片查看器
  const openImageViewer = (index: number) => {
    setImageViewerIndex(index);
    setImageViewerVisible(true);
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

  if (!isNewProject && !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">项目不存在</p>
          <button
            onClick={() => navigate('/admin/projects')}
            className="px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-lg"
          >
            返回项目列表
          </button>
        </div>
      </div>
    );
  }

  const images = project?.images || [];
  const isEditMode = pageMode === 'editMode' || pageMode === 'createMode';

  return (
    <div className="min-h-full bg-slate-50/50">
      {/* 顶部导航栏 */}
      <div
        className={`sticky top-0 z-10 border-b ${
          isEditMode ? 'bg-blue-50/80 border-blue-200' : 'bg-white/80 border-slate-200'
        } backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/projects')}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="返回项目列表"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {isEditMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isNewProject ? '请输入项目名称' : undefined}
                className="text-lg font-semibold text-slate-800 bg-transparent border-b-2 border-transparent focus:border-emerald-500 outline-none px-1"
              />
            ) : (
              <div>
                <h1 className="text-lg font-semibold text-slate-800">{project?.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    project?.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {project?.status === 1 ? '已发布' : '草稿'}
                  </span>
                  {project?.isFeatured === 1 && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">精品</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={() => isNewProject ? navigate('/admin/projects') : handleExitEditMode()}
                  disabled={saving}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 text-sm flex items-center gap-1"
                >
                  {saving && (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isNewProject ? '创建' : '保存'}
                </button>
              </>
            ) : (
              <>
                {/* 快捷操作按钮 */}
                <button
                  onClick={() => {
                    const newStatus = project?.status === 1 ? 0 : 1;
                    updateProjectStatus(project!.id, newStatus).then(() => {
                      loadProject();
                      toast.success(newStatus === 1 ? '已发布' : '已下架');
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    project?.status === 1
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {project?.status === 1 ? '下架' : '发布'}
                </button>
                <button
                  onClick={() => {
                    const newFeatured = (project?.isFeatured || 0) === 1 ? 0 : 1;
                    setProjectFeatured(project!.id, newFeatured).then(() => {
                      loadProject();
                      toast.success(newFeatured === 1 ? '已设为精品' : '已取消精品');
                    }).catch((err: any) => {
                      toast.error(err.message || '操作失败');
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (project?.isFeatured || 0) === 1
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {(project?.isFeatured || 0) === 1 ? '取消精品' : '设为精品'}
                </button>
                <button
                  onClick={() => handleEnterEditMode()}
                  className="px-3 py-1.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    const imageCount = project?.images?.length || 0;
                    let message = `确定要删除项目"${project?.name}"吗？`;
                    if (imageCount > 0) {
                      message += '\n\n';
                      message += `该项目关联了 ${imageCount} 张图片，删除后将一并移除。`;
                    }
                    message += '\n\n此操作不可恢复。';
                    setConfirmConfig({
                      show: true,
                      title: '确认删除',
                      message,
                      onConfirm: async () => {
                        try {
                          await deleteProject(project!.id);
                          toast.success('项目已删除');
                          navigate('/admin/projects');
                        } catch (err: any) {
                          toast.error('删除失败：' + err.message);
                        }
                        setConfirmConfig(null);
                      },
                    });
                  }}
                  className="px-3 py-1.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  删除
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="max-w-7xl mx-auto p-6">
        {pageMode === 'createMode' ? (
          /* 新建项目表单 */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800 mb-4">新建项目</h3>
              <div className="space-y-4">
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

                {/* 新建模式下的图片上传区域 */}
                <div>
                  <label className="block text-sm text-slate-600 mb-2">项目图片</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                  >
                    <svg className="w-10 h-10 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium mb-1">点击选择图片</p>
                    <p className="text-slate-400 text-sm">支持多张图片，保存项目时会一起关联</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUploadTempImages}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>

                  {/* 暂存的图片列表 */}
                  {pendingImageFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">已上传 {pendingImageFiles.length} 张图片</span>
                        <button
                          onClick={() => {
                            setPendingTempImageIds([]);
                            setPendingImageFiles([]);
                          }}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          清空
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {pendingImageFiles.map((item) => (
                          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
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
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="移除"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploading && (
                    <div className="mt-3 flex items-center gap-2 text-emerald-600">
                      <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm">上传中...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 查看/编辑现有项目 - 5:7 布局 */
          <div className="grid grid-cols-12 gap-6">
            {/* 左侧：基本信息区 (5 列) */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
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
                    {isEditMode ? (
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
                      <div className="text-slate-800 font-medium">{project?.categoryName}</div>
                    )}
                  </div>

                  {/* 项目名称 */}
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">项目名称</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                        placeholder="请输入项目名称"
                      />
                    ) : (
                      <div className="text-slate-800 font-medium">{project?.name}</div>
                    )}
                  </div>

                  {/* 位置和年份 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">项目位置</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                          placeholder="例如：上海、北京"
                        />
                      ) : (
                        <div className="text-slate-800 font-medium">{project?.location || '-'}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">设计年份</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                          placeholder="例如：2024"
                        />
                      ) : (
                        <div className="text-slate-800 font-medium">{project?.year || '-'}</div>
                      )}
                    </div>
                  </div>

                  {/* 状态和精品标签 */}
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">项目状态</label>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          project?.status === 1
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {project?.status === 1 ? '已发布' : '未发布'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          project?.isFeatured === 1
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {project?.isFeatured === 1 ? '精品' : '普通'}
                      </span>
                    </div>
                  </div>

                  {/* 项目描述 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-slate-500">项目描述</label>
                      {isEditMode && (
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
                    {isEditMode ? (
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none text-sm leading-relaxed"
                        rows={5}
                        placeholder="请输入项目描述..."
                      />
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {project?.description || '暂无描述'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：图片区 (7 列) - 紧凑网格布局 */}
            <div className="col-span-12 lg:col-span-7">
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    项目图片
                    {images.length > 0 && (
                      <span className="text-xs text-slate-400 font-normal">({images.length}张)</span>
                    )}
                  </h3>
                  {isEditMode && (
                    <label className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-xs cursor-pointer flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传图片
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

                {images.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">暂无图片</p>
                    {isEditMode && <p className="text-xs mt-1">点击上方按钮上传图片</p>}
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-4 gap-3">
                        {images.map((img, index) => (
                          <SortableImageItem
                            key={img.id}
                            image={img}
                            onClick={() => openImageViewer(index)}
                            onSetCover={() => handleSetCover(img.id)}
                            onDelete={() => handleDeleteImage(img.id)}
                            isEditMode={isEditMode}
                          />
                        ))}
                        {isEditMode && (
                          <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                            <div className="text-center">
                              <svg className="w-6 h-6 text-slate-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span className="text-xs text-slate-400">添加图片</span>
                            </div>
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
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 图片查看器弹窗 */}
      <ImageViewer
        images={images}
        currentIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
        onNavigate={(index) => setImageViewerIndex(index)}
      />

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
            <p className="text-slate-600 mb-6 whitespace-pre-line">{confirmConfig.message}</p>
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
