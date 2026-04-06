import { useState, useEffect } from 'react';
import { getProjects, deleteProject, uploadImages, createProject, updateProject, updateProjectStatus, getCategories, getProjectImages, deleteImage, setAsCover, setProjectFeatured } from '@/services/admin';
import { toast } from 'sonner';
import AiCopywritingModal from './components/AiCopywritingModal';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryId: number;
  categoryName: string;
  status: number;
  isFeatured?: number;
}

interface Category {
  id: number;
  name: string;
}

interface ProjectImage {
  id: number;
  attachmentId: number;
  imageName: string;
  width: number;
  height: number;
  fileSize: number;
  isCover: number;
}

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    year: '',
    categoryId: 1,
    description: '',
    sortOrder: 0,
    status: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // AI 文案生成
  const [showAiModal, setShowAiModal] = useState(false);
  const [currentAiProjectId, setCurrentAiProjectId] = useState<number | null>(null);
  const [currentAiProjectName, setCurrentAiProjectName] = useState<string>('');
  // AI 生成的文案内容，用于一键应用
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>('');

  // 分页状态
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  // 筛选状态
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [filterFeatured, setFilterFeatured] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  // 搜索关键词（带防抖）
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data || []);
    });
  }, []);

  // 搜索防抖：300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadProjects();
  }, [pagination.page, pagination.size, filterCategory, filterFeatured, filterStatus, searchKeyword]);

  const loadProjects = () => {
    setLoading(true);
    getProjects(pagination.page, pagination.size, filterCategory, searchKeyword || undefined, filterFeatured)
      .then((data) => {
        setProjects(data.list || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 清除所有筛选条件
  const handleClearFilters = () => {
    setFilterCategory(undefined);
    setFilterFeatured(undefined);
    setFilterStatus(undefined);
    setSearchInput('');
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 是否有激活的筛选条件
  const hasActiveFilters = filterCategory !== undefined || filterFeatured !== undefined || filterStatus !== undefined || searchInput !== '';

  const handleDelete = (id: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这个项目吗？删除项目将同时删除所有相关图片。',
      onConfirm: () => {
        deleteProject(id).then(() => {
          loadProjects();
          toast.success('项目已删除');
        });
        setConfirmConfig(null);
      }
    });
  };

  const handleStatusChange = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateProjectStatus(id, newStatus).then(() => {
      loadProjects();
    });
  };

  const handleFeaturedChange = (id: number, currentFeatured?: number) => {
    const newFeatured = (currentFeatured || 0) === 1 ? 0 : 1;
    setProjectFeatured(id, newFeatured).then(() => {
      loadProjects();
      toast.success(newFeatured === 1 ? '已设为精品项目' : '已取消精品项目');
    }).catch((err: any) => {
      toast.error(err.message || '操作失败');
    });
  };

  const handleOpenAiCopywriting = (projectId: number, projectName: string) => {
    setCurrentAiProjectId(projectId);
    setCurrentAiProjectName(projectName);
    setAiGeneratedContent('');
    setShowAiModal(true);
  };

  const handleViewDetail = (projectId: number) => {
    navigate(`/admin/projects/${projectId}`);
  };

  // AI 文案一键应用到项目描述
  const handleApplyAiContent = (content: string) => {
    setAiGeneratedContent(content);
    // 如果有正在编辑的项目，直接填充描述字段
    if (editingProject) {
      setFormData(prev => ({ ...prev, description: content }));
    }
    // 打开编辑弹窗
    handleOpenModal(editingProject || undefined);
    setShowAiModal(false);
    toast.success('文案已应用到项目描述');
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        location: project.location || '',
        year: project.year || '',
        categoryId: project.categoryId || 1,
        description: aiGeneratedContent || '', // 优先使用 AI 生成的文案
        sortOrder: 0,
        status: project.status,
      });
      setAiGeneratedContent(''); // 清空临时内容
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        location: '',
        year: '',
        categoryId: categories.length > 0 ? categories[0].id : 1,
        description: '',
        sortOrder: 0,
        status: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData).then(() => {
        setShowModal(false);
        loadProjects();
      });
    } else {
      createProject(formData).then(() => {
        setShowModal(false);
        loadProjects();
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await uploadImages(projectId, Array.from(files));
      toast.success('图片上传成功');
      if (currentProjectId === projectId) {
        loadProjectImages(projectId);
      }
    } catch (err: any) {
      toast.error('上传失败：' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManageImages = (projectId: number) => {
    setCurrentProjectId(projectId);
    setShowImageModal(true);
    loadProjectImages(projectId);
  };

  const loadProjectImages = (projectId: number) => {
    setLoadingImages(true);
    getProjectImages(projectId)
      .then((images) => {
        setProjectImages(images || []);
      })
      .finally(() => {
        setLoadingImages(false);
      });
  };

  const handleDeleteImage = async (imageId: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这张图片吗？',
      onConfirm: async () => {
        try {
          await deleteImage(imageId);
          toast.success('图片已删除');
          if (currentProjectId) {
            loadProjectImages(currentProjectId);
          }
        } catch (err: any) {
          toast.error('删除失败：' + err.message);
        }
        setConfirmConfig(null);
      }
    });
  };

  const handleSetCover = async (imageId: number) => {
    try {
      await setAsCover(imageId);
      toast.success('封面设置成功');
      if (currentProjectId) {
        loadProjectImages(currentProjectId);
      }
    } catch (err: any) {
      toast.error('设置封面失败：' + err.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
        <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新建项目
        </button>

        <div className="flex-1 flex items-center gap-2">
          {/* 搜索框 - 带防抖 */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              placeholder="搜索项目名称..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm placeholder:text-slate-400"
            />
            <svg className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 分类筛选 */}
          <select
            value={filterCategory || ''}
            onChange={(e) => {
              setFilterCategory(e.target.value ? Number(e.target.value) : undefined);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm min-w-[120px]"
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* 状态筛选 */}
          <select
            value={filterStatus ?? ''}
            onChange={(e) => {
              setFilterStatus(e.target.value === '' ? undefined : Number(e.target.value));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm min-w-[100px]"
          >
            <option value="">全部状态</option>
            <option value="1">已发布</option>
            <option value="0">草稿</option>
          </select>

          {/* 精品筛选 */}
          <select
            value={filterFeatured ?? ''}
            onChange={(e) => {
              setFilterFeatured(e.target.value === '' ? undefined : Number(e.target.value));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm min-w-[100px]"
          >
            <option value="">全部</option>
            <option value="1">精品项目</option>
            <option value="0">普通项目</option>
          </select>

          {/* 清除筛选按钮 */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-sm font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除筛选
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex-1">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex-1">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-slate-600 mb-4">暂无项目</p>
          <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all">
            创建第一个项目
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">项目名称</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">分类</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">位置</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">年份</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">精品</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project, index) => (
                  <tr key={project.id} className={`hover:bg-slate-50/80 transition-colors ${index % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-6 py-4 text-sm text-slate-600">{project.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{project.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{project.categoryName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{project.location}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{project.year}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        project.status === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {project.status === 1 ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        project.isFeatured === 1 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {project.isFeatured === 1 ? '精品' : '普通'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 主要操作：查看 */}
                        <button
                          onClick={() => handleViewDetail(project.id)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          查看
                        </button>

                        {/* 主要操作：编辑 */}
                        <button
                          onClick={() => handleOpenModal(project)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          编辑
                        </button>

                        {/* 主要操作：图片管理 */}
                        <button
                          onClick={() => handleManageImages(project.id)}
                          className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          图片
                        </button>

                        {/* 更多操作下拉菜单 */}
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              const action = e.target.value;
                              e.target.value = ''; // 重置选择
                              if (!action) return;

                              if (action === 'ai') {
                                handleOpenAiCopywriting(project.id, project.name);
                              } else if (action === 'status') {
                                handleStatusChange(project.id, project.status);
                              } else if (action === 'featured') {
                                handleFeaturedChange(project.id, project.isFeatured);
                              } else if (action === 'delete') {
                                handleDelete(project.id);
                              }
                            }}
                            value=""
                            className="px-2 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-xs cursor-pointer outline-none border border-slate-200"
                          >
                            <option value="">更多</option>
                            <option value="ai">✨ AI 文案</option>
                            <option value="status">{project.status === 1 ? '下架' : '发布'}</option>
                            <option value="featured">{project.isFeatured === 1 ? '取消精品' : '设为精品'}</option>
                            <option value="delete" className="text-red-600">删除</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页控件 */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-sm text-slate-600">
                共 <span className="font-medium text-slate-700">{pagination.total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pagination.size}
                  onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value), page: 1 }))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:bg-white focus:border-emerald-400 outline-none"
                >
                  <option value={10}>10 条/页</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                </select>
                {/* 首页按钮 */}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
                >
                  首页
                </button>
                {/* 上一页按钮 */}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
                >
                  上一页
                </button>
                {/* 页码输入 */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max={Math.ceil(pagination.total / pagination.size)}
                    defaultValue={pagination.page}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt((e.target as HTMLInputElement).value);
                        const maxPage = Math.ceil(pagination.total / pagination.size);
                        if (page >= 1 && page <= maxPage) {
                          setPagination(prev => ({ ...prev, page }));
                        }
                      }
                    }}
                    className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center text-sm bg-white text-slate-800 focus:border-emerald-400 outline-none"
                  />
                  <span className="text-sm text-slate-600">/ {Math.ceil(pagination.total / pagination.size)}</span>
                </div>
                {/* 下一页按钮 */}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
                >
                  下一页
                </button>
                {/* 末页按钮 */}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.ceil(pagination.total / pagination.size) }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
                >
                  末页
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 新建/编辑项目弹窗 - 支持 ESC 和点击遮罩关闭 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowModal(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">{editingProject ? '编辑项目' : '新建项目'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  分类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="请输入项目名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="例如：上海、北京"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">年份</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="例如：2024"
                  min="1900"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">项目描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all placeholder:text-slate-400 resize-none"
                  placeholder="请输入项目描述，可从 AI 文案生成后一键应用"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 图片管理弹窗 - 支持 ESC 和点击遮罩关闭 */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImageModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowImageModal(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">图片管理</h2>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <label className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200 cursor-pointer flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                上传图片
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && currentProjectId) {
                      handleImageUpload(e, currentProjectId);
                    }
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <span className="text-sm text-slate-600">{uploading ? '上传中...' : ''}</span>
            </div>

            {loadingImages ? (
              <div className="text-center py-10 text-slate-600">加载中...</div>
            ) : projectImages.length === 0 ? (
              <div className="text-center py-10 text-slate-600">暂无图片</div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4">
                  {projectImages.map((img) => (
                    <div key={img.id} className="relative border border-slate-200 rounded-xl p-3">
                      <img
                        src={`/api/images/${img.id}?t=${Date.now()}`}
                        alt={img.imageName}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">加载失败</text></svg>';
                        }}
                      />
                      {img.isCover === 1 && (
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg font-medium">封面</span>
                      )}
                      <div className="mt-3 flex gap-2 text-sm">
                        {img.isCover !== 1 && (
                          <button
                            onClick={() => handleSetCover(img.id)}
                            className="text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors font-medium"
                          >
                            设为封面
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 确认对话框 - 支持 ESC 和点击遮罩关闭 */}
      {confirmConfig?.show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmConfig(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setConfirmConfig(null);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
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
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-lg shadow-red-200"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI 文案生成对话框 */}
      {currentAiProjectId && (
        <AiCopywritingModal
          projectId={currentAiProjectId}
          projectName={currentAiProjectName}
          visible={showAiModal}
          onClose={() => setShowAiModal(false)}
          onApply={handleApplyAiContent}
        />
      )}
    </div>
  );
};

export default AdminProjects;
