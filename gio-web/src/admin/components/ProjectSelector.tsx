import { useState, useEffect } from 'react';
import { getProjects, getCategories, ProjectImage } from '@/services/admin';
import { toast } from 'sonner';

interface ProjectSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (projectId: number, images: ProjectImage[]) => void;
}

interface ProjectItem {
  id: number;
  name: string;
  location: string;
  categoryId: number;
  categoryName: string;
  coverImageId?: number;
  images: ProjectImage[];
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  visible,
  onClose,
  onSelect
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // null = 全部分类
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  // 加载分类
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  // 加载项目列表
  useEffect(() => {
    if (visible) {
      loadProjects();
    }
  }, [visible, selectedCategory, searchKeyword]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('加载分类失败', error);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await getProjects(1, 100, selectedCategory || undefined, searchKeyword || undefined);
      // 获取每个项目的图片
      const projectsWithImages = await Promise.all(
        (result.list || []).map(async (p) => {
          try {
            const detail = await getProjectDetail(p.id);
            return {
              id: p.id,
              name: p.name,
              location: p.location,
              categoryId: p.categoryId,
              categoryName: p.categoryName,
              coverImageId: p.coverImageId,
              images: detail.images || []
            };
          } catch {
            return {
              id: p.id,
              name: p.name,
              location: p.location,
              categoryId: p.categoryId,
              categoryName: p.categoryName,
              coverImageId: p.coverImageId,
              images: []
            };
          }
        })
      );
      setProjects(projectsWithImages);
    } catch (error: any) {
      toast.error('加载项目失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取项目详情
  const getProjectDetail = async (id: number) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
    });
    return res.json();
  };

  // 处理分类选择
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSelectedProject(null);
    setSelectedImages(new Set());
  };

  // 处理项目选择
  const handleProjectClick = (project: ProjectItem) => {
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
      setSelectedImages(new Set());
    } else {
      setSelectedProject(project);
      setSelectedImages(new Set());
    }
  };

  // 处理图片选择
  const handleImageClick = (imageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (!selectedProject) return;
    if (selectedImages.size === selectedProject.images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(selectedProject.images.map(img => img.id)));
    }
  };

  // 确认选择
  const handleConfirm = () => {
    if (!selectedProject) {
      toast.error('请先选择一个项目');
      return;
    }
    const selectedImagesList = selectedProject.images.filter(img => selectedImages.has(img.id));
    onSelect(selectedProject.id, selectedImagesList);
    handleClose();
  };

  // 关闭弹窗
  const handleClose = () => {
    setSelectedProject(null);
    setSelectedImages(new Set());
    setSearchKeyword('');
    setSelectedCategory(null);
    onClose();
  };

  // 计算有多少张图片被选中
  const getSelectedCount = () => selectedImages.size;

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">选择项目</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              选择一个项目及其图片，用于生成推文素材
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 分类 Tab */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-emerald-500 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索项目名称..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex">
          {/* 左侧：项目列表 */}
          <div className="w-72 border-r border-slate-200 overflow-y-auto shrink-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm">
                <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                暂无项目
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                      selectedProject?.id === project.id
                        ? 'bg-emerald-50 border-2 border-emerald-400'
                        : 'bg-white border-2 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {/* 项目封面 */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {project.coverImageId ? (
                        <img
                          src={`/api/images/${project.coverImageId}`}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* 项目信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{project.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {project.categoryName} · {project.images.length} 张图片
                      </div>
                    </div>
                    {/* 选中标识 */}
                    {selectedProject?.id === project.id && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧：图片网格 */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            {!selectedProject ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <svg className="w-16 h-16 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">请在左侧选择一个项目</p>
              </div>
            ) : selectedProject.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <svg className="w-16 h-16 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">该项目暂无图片</p>
              </div>
            ) : (
              <div>
                {/* 图片选择操作栏 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{selectedProject.name}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span>{selectedImages.size} / {selectedProject.images.length} 张选中</span>
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {selectedImages.size === selectedProject.images.length ? '取消全选' : '全选'}
                  </button>
                </div>

                {/* 图片网格 */}
                <div className="grid grid-cols-3 gap-3">
                  {selectedProject.images.map((image) => {
                    const isSelected = selectedImages.has(image.id);
                    return (
                      <button
                        key={image.id}
                        onClick={(e) => handleImageClick(image.id, e)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-emerald-500 shadow-lg'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        {/* 图片 */}
                        <div className="aspect-square bg-slate-100">
                          <img
                            src={`/api/images/${image.id}`}
                            alt={image.imageName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* 选中标识 */}
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'bg-white/80 border-slate-300 opacity-0 group-hover:opacity-100'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* 封面标识 */}
                        {image.isCover === 1 && (
                          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                            封面
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-500">
            {selectedProject && (
              <span>已选择 {getSelectedCount()} 张图片</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-white transition-all"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedProject || selectedImages.size === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认选择 {selectedProject && selectedImages.size > 0 && `(${getSelectedCount()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelector;
