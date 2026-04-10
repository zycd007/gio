import { useState, useEffect } from 'react';
import { getProjects, getCategories, batchUpdateProjectStatus, batchSetProjectFeatured, batchDeleteProjects } from '@/services/admin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PlaceholderImage from '@/components/PlaceholderImage';
import CreateProjectModal from './components/CreateProjectModal';

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryId: number;
  categoryName: string;
  status: number;
  isFeatured?: number;
  coverImageId?: number;
}

interface Category {
  id: number;
  name: string;
}

// 简洁的项目卡片 - 只展示信息，点击进入详情
const ProjectCard = ({
  project,
  onClick,
  selectable,
  selected,
  onSelect
}: {
  project: Project;
  onClick: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) => {
  const isPublished = project.status === 1;
  const isFeatured = project.isFeatured === 1;

  return (
    <div
      onClick={selectable ? onSelect : onClick}
      className={`bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer group ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300'
      }`}
    >
      {/* 封面 */}
      <div className="relative h-36 bg-slate-100 overflow-hidden">
        {project.coverImageId ? (
          <img
            src={`/api/images/${project.coverImageId}/thumbnail`}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <PlaceholderImage className="w-full h-full" />
        )}
        {/* 状态标签 */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
            {isPublished ? '已发布' : '草稿'}
          </span>
          {isFeatured && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
              精品
            </span>
          )}
        </div>
        {/* 选择模式下显示复选框 */}
        {selectable && (
          <div className="absolute top-2 right-2">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              selected
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-white border-slate-300 hover:border-emerald-400'
            }`}>
              {selected && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-slate-800 truncate">{project.name}</h3>
        <p className="text-xs text-slate-500 mt-1 truncate">
          {project.categoryName}
          {project.location && ` · ${project.location}`}
          {project.year && ` · ${project.year}`}
        </p>
      </div>
    </div>
  );
};

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 分页状态
  const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });

  // 搜索筛选
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [filterFeatured, setFilterFeatured] = useState<number | undefined>(undefined);

  // 批量操作
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 新建项目弹窗
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data || []);
    });
  }, []);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchInput);
      setPagination(prev => ({ ...prev, page: 1 })); // 搜索时重置页码
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadProjects();
  }, [filterCategory, filterFeatured, filterStatus, searchKeyword, pagination.page, pagination.size]);

  const loadProjects = (clearSelection = true) => {
    setLoading(true);
    getProjects(pagination.page, pagination.size, filterCategory, searchKeyword || undefined, filterFeatured, filterStatus)
      .then((data) => {
        setProjects(data.list || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
        if (clearSelection) {
          setSelectedIds(new Set());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearFilters = () => {
    setFilterCategory(undefined);
    setFilterFeatured(undefined);
    setFilterStatus(undefined);
    setSearchInput('');
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = filterCategory !== undefined || filterFeatured !== undefined || filterStatus !== undefined || searchInput !== '';

  // 新建项目
  const handleCreateProject = () => {
    setCreateModalVisible(true);
  };

  // 批量操作
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    setSelectedIds(new Set(projects.map(p => p.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBatchStatus = (status: number) => {
    const ids = Array.from(selectedIds);
    const action = status === 1 ? '上架' : '下架';
    setConfirmModal({
      show: true,
      title: `批量${action}`,
      message: `确定要将 ${ids.length} 个项目${action}吗？`,
      onConfirm: () => {
        batchUpdateProjectStatus(ids, status).then(() => {
          toast.success(`已批量${action} ${ids.length} 个项目`);
          loadProjects(false);
        });
        setConfirmModal(null);
      }
    });
  };

  const handleBatchFeatured = (isFeatured: number) => {
    const ids = Array.from(selectedIds);
    const action = isFeatured === 1 ? '设为精品' : '取消精品';
    setConfirmModal({
      show: true,
      title: `批量${action}`,
      message: `确定要将 ${ids.length} 个项目${action}吗？`,
      onConfirm: () => {
        batchSetProjectFeatured(ids, isFeatured).then(() => {
          toast.success(`已批量${action} ${ids.length} 个项目`);
          loadProjects(false);
        });
        setConfirmModal(null);
      }
    });
  };

  const handleBatchDelete = () => {
    const ids = Array.from(selectedIds);
    setConfirmModal({
      show: true,
      title: '批量删除',
      message: `确定要删除 ${ids.length} 个项目吗？此操作不可恢复。`,
      onConfirm: () => {
        batchDeleteProjects(ids).then(() => {
          toast.success(`已删除 ${ids.length} 个项目`);
          loadProjects(false);
        });
        setConfirmModal(null);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-slate-100 shrink-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">项目管理</h2>
          <span className="text-sm text-slate-500">共 {pagination.total} 个项目</span>
          {selectMode && selectedIds.size > 0 && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-sm font-medium">
              已选 {selectedIds.size} 个
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectMode ? (
            <>
              <button
                onClick={toggleSelectMode}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
              >
                取消选择
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新建
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleSelectMode}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                批量操作
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新建
              </button>
            </>
          )}
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {selectMode && (
        <div className="bg-emerald-50 border-b border-emerald-100 shrink-0 px-6 py-3 flex items-center gap-3">
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            全选
          </button>
          <button
            onClick={clearSelection}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            清空
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={() => handleBatchStatus(1)}
                className="px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
               上架
              </button>
              <button
                onClick={() => handleBatchStatus(0)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                下架
              </button>
              <button
                onClick={() => handleBatchFeatured(1)}
                className="px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                设为精品
              </button>
              <button
                onClick={() => handleBatchFeatured(0)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消精品
              </button>
              <div className="h-4 w-px bg-slate-300 mx-1"></div>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </>
          )}
        </div>
      )}

      {/* 筛选工具 */}
      <div className="bg-white border-b border-slate-100 shrink-0 px-6 py-2.5 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs min-w-[200px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchKeyword(searchInput)}
            placeholder="搜索项目..."
            className="w-full pl-9 pr-9 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            onClick={() => setSearchKeyword(searchInput)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors"
            title="搜索"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <select
          value={filterCategory || ''}
          onChange={(e) => {
            setFilterCategory(e.target.value ? Number(e.target.value) : undefined);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none cursor-pointer"
        >
          <option value="">全部分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {filterCategory && (
          <button
            onClick={() => {
              setFilterCategory(undefined);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-2 py-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors text-sm flex items-center gap-1"
            title="清除分类筛选"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <select
          value={filterStatus ?? ''}
          onChange={(e) => {
            setFilterStatus(e.target.value === '' ? undefined : Number(e.target.value));
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none cursor-pointer"
        >
          <option value="">全部状态</option>
          <option value="1">已发布</option>
          <option value="0">草稿</option>
        </select>

        <select
          value={filterFeatured ?? ''}
          onChange={(e) => {
            setFilterFeatured(e.target.value === '' ? undefined : Number(e.target.value));
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none cursor-pointer"
        >
          <option value="">全部</option>
          <option value="1">精品</option>
          <option value="0">普通</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除
          </button>
        )}
      </div>

      {/* 卡片网格 */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="h-36 bg-slate-100 animate-pulse"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-500 mb-3">暂无项目</p>
              <button onClick={handleCreateProject} className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg">
                创建第一个项目
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/admin/projects/${project.id}`)}
                selectable={selectMode}
                selected={selectedIds.has(project.id)}
                onSelect={() => toggleSelect(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {pagination.total > 0 && (
        <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between">
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
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
            >
              首页
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={Math.ceil(pagination.total / pagination.size)}
                value={pagination.page}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  const maxPage = Math.ceil(pagination.total / pagination.size);
                  if (page >= 1 && page <= maxPage) {
                    setPagination(prev => ({ ...prev, page }));
                  }
                }}
                className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center text-sm bg-white text-slate-800 focus:border-emerald-400 outline-none"
              />
              <span className="text-sm text-slate-600">/ {Math.ceil(pagination.total / pagination.size)}</span>
            </div>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors text-sm"
            >
              下一页
            </button>
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

      {/* 确认弹窗 */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmModal(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{confirmModal.title}</h2>
            <p className="text-slate-600 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  confirmModal.title.includes('删除')
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建项目弹窗 */}
      <CreateProjectModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={loadProjects}
      />
    </div>
  );
};

export default AdminProjects;