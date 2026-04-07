import { useState, useEffect } from 'react';
import {
  getCopywritings,
  deleteCopywriting,
  Copywriting,
} from '@/services/copywriting';
import { toast } from 'sonner';
import CopywritingModal from './components/CopywritingModal';
import CopywritingDetailModal from './components/CopywritingDetailModal';

const AdminCopywritings = () => {
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });

  // 筛选状态
  const [filterSourceType, setFilterSourceType] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCopywriting, setEditingCopywriting] = useState<Copywriting | null>(null);
  const [viewingCopywriting, setViewingCopywriting] = useState<Copywriting | null>(null);

  // 确认对话框
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    loadCopywritings();
  }, [pagination.page, pagination.size, filterSourceType, filterStatus, searchKeyword]);

  const loadCopywritings = () => {
    setLoading(true);
    getCopywritings(pagination.page, pagination.size, undefined, filterStatus, filterSourceType, searchKeyword || undefined)
      .then((data) => {
        setCopywritings(data.list || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 清除筛选
  const handleClearFilters = () => {
    setFilterSourceType(undefined);
    setFilterStatus(undefined);
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = filterSourceType !== undefined || filterStatus !== undefined || searchKeyword !== '';

  const handleDelete = (id: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这条推文吗？',
      onConfirm: () => {
        deleteCopywriting(id).then(() => {
          loadCopywritings();
          toast.success('推文已删除');
        }).catch((err: any) => {
          toast.error('删除失败：' + err.message);
        });
        setConfirmConfig(null);
      }
    });
  };

  const handleOpenModal = (copywriting?: Copywriting) => {
    setEditingCopywriting(copywriting || null);
    setShowModal(true);
  };

  const handleOpenDetail = (copywriting: Copywriting) => {
    setViewingCopywriting(copywriting);
    setShowDetailModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    loadCopywritings();
    toast.success('保存成功');
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新建推文
        </button>

        <div className="flex-1 flex items-center gap-2">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              placeholder="搜索推文标题或内容..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm placeholder:text-slate-400"
            />
            <svg className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 来源类型筛选 */}
          <select
            value={filterSourceType ?? ''}
            onChange={(e) => {
              setFilterSourceType(e.target.value === '' ? undefined : Number(e.target.value));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-sm min-w-[120px]"
          >
            <option value="">全部来源</option>
            <option value="1">项目生成</option>
            <option value="2">自由创作</option>
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
            <option value="0">草稿</option>
            <option value="1">已发布</option>
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

      {/* 内容区域 */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex-1">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      ) : copywritings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex-1">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-600 mb-4">暂无推文</p>
          <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all">
            创建第一条推文
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">关联项目</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">来源</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">风格</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">创建时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {copywritings.map((copywriting, index) => (
                  <tr key={copywriting.id} className={`hover:bg-emerald-50/50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-6 py-4 text-sm text-slate-600">{copywriting.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="max-w-md">
                        <div className="font-medium text-slate-800 truncate">{copywriting.title}</div>
                        <div className="text-slate-400 text-xs truncate mt-0.5">{copywriting.content.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {copywriting.projectName ? (
                        <span className="text-emerald-600 font-medium">{copywriting.projectName}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        copywriting.sourceType === 1
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-purple-50 text-purple-600 border border-purple-200'
                      }`}>
                        {copywriting.sourceType === 1 ? '项目生成' : '自由创作'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-slate-600">{copywriting.styleName || copywriting.style}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        copywriting.status === 1
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {copywriting.status === 1 ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(copywriting.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(copywriting)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          查看
                        </button>
                        <button
                          onClick={() => handleOpenModal(copywriting)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(copywriting.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页控件 */}
          {pagination.total > 0 && (
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
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
        </div>
      )}

      {/* 新建/编辑推文弹窗 */}
      {showModal && (
        <CopywritingModal
          copywriting={editingCopywriting}
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      {/* 推文详情弹窗 */}
      {showDetailModal && viewingCopywriting && (
        <CopywritingDetailModal
          copywriting={viewingCopywriting}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* 确认对话框 */}
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
    </div>
  );
};

export default AdminCopywritings;
