import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPostList, deletePost, updatePublishStatus } from '@/services/socialPost';
import { SocialPostListItem } from '@/types/socialPost';
import { toast } from 'sonner';
import GeneratePostModal from './components/GeneratePostModal';

interface Stats {
  total: number;
  projectSource: number;
  custom: number;
  published: number;
}

const AdminSocialPosts = () => {
  // 列表数据
  const [posts, setPosts] = useState<SocialPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    projectSource: 0,
    custom: 0,
    published: 0
  });

  // 分页状态
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });

  // 筛选状态
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  // 确认弹窗
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 生成推文弹窗
  const [generateModalVisible, setGenerateModalVisible] = useState(false);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 加载列表
  useEffect(() => {
    loadPosts();
  }, [filterType, filterStatus, searchKeyword, pagination.page, pagination.size]);

  const loadPosts = () => {
    setLoading(true);
    getPostList(
      pagination.page,
      pagination.size,
      filterType || undefined,
      filterStatus,
      searchKeyword || undefined
    )
      .then((data) => {
        setPosts(data.list || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));

        // 计算统计
        const list = data.list || [];
        setStats({
          total: data.total || 0,
          projectSource: list.filter(p => p.type === 'project').length,
          custom: list.filter(p => p.type === 'custom').length,
          published: list.filter(p => p.status === 1).length
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearFilters = () => {
    setFilterType('');
    setFilterStatus(undefined);
    setSearchInput('');
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = filterType !== '' || filterStatus !== undefined || searchInput !== '';

  // 删除推文
  const handleDelete = (id: number) => {
    setConfirmModal({
      show: true,
      title: '删除推文',
      message: '确定要删除这条推文吗？此操作不可恢复。',
      onConfirm: () => {
        deletePost(id).then(() => {
          toast.success('删除成功');
          loadPosts();
        }).catch((err: any) => {
          toast.error('删除失败：' + err.message);
        });
        setConfirmModal(null);
      }
    });
  };

  // 标记发布/取消发布
  const handleTogglePublish = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? '发布' : '取消发布';

    setConfirmModal({
      show: true,
      title: `${action}推文`,
      message: `确定要${action}这条推文吗？`,
      onConfirm: () => {
        updatePublishStatus(id, newStatus).then(() => {
          toast.success(`${action}成功`);
          loadPosts();
        }).catch((err: any) => {
          toast.error(`${action}失败：` + err.message);
        });
        setConfirmModal(null);
      }
    });
  };

  // 生成成功后刷新列表
  const handleGenerateSuccess = () => {
    toast.success('推文生成成功');
    loadPosts();
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-slate-100 shrink-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">推文管理</h2>
          <span className="text-sm text-slate-500">共 {pagination.total} 条推文</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGenerateModalVisible(true)}
            className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            生成新推文
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="bg-slate-50 border-b border-slate-100 shrink-0 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
          <span className="text-sm text-slate-600">总计</span>
          <span className="text-lg font-semibold text-slate-800">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
          <span className="text-sm text-slate-600">项目源</span>
          <span className="text-lg font-semibold text-blue-600">{stats.projectSource}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
          <span className="text-sm text-slate-600">自定义</span>
          <span className="text-lg font-semibold text-purple-600">{stats.custom}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
          <span className="text-sm text-slate-600">已发布</span>
          <span className="text-lg font-semibold text-emerald-600">{stats.published}</span>
        </div>
      </div>

      {/* 筛选工具 */}
      <div className="bg-white border-b border-slate-100 shrink-0 px-6 py-2.5 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs min-w-[200px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchKeyword(searchInput)}
            placeholder="搜索推文..."
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
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none cursor-pointer"
        >
          <option value="">全部类型</option>
          <option value="project">项目源</option>
          <option value="custom">自定义</option>
        </select>

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

      {/* 表格 */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 border-b border-slate-100 flex items-center px-4 gap-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-500 mb-3">暂无推文</p>
              <button
                onClick={() => setGenerateModalVisible(true)}
                className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg"
              >
                生成第一条推文
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">标题</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">项目</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">类型</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">状态</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">创建时间</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-800 font-medium">{post.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        {post.projectName ? (
                          <span className="text-sm text-slate-600">{post.projectName}</span>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          post.type === 'project'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {post.type === 'project' ? '项目源' : '自定义'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          post.status === 1
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {post.status === 1 ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/social-posts/${post.id}`}
                            className="px-2.5 py-1 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            详情
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(post.id, post.status)}
                            className={`px-2.5 py-1 text-sm rounded-lg transition-colors ${
                              post.status === 1
                                ? 'text-slate-600 hover:bg-slate-100'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {post.status === 1 ? '取消发布' : '发布'}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-2.5 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 生成推文弹窗 */}
      <GeneratePostModal
        visible={generateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        onSuccess={handleGenerateSuccess}
      />
    </div>
  );
};

export default AdminSocialPosts;