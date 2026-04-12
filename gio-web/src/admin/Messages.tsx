import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage, clearAllMessages } from '@/services/admin';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: number;
  name: string;
  phone: string;
  content: string;
  status: number;
  createdAt: string;
}

const AdminMessages = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 从 URL 参数读取初始筛选状态
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam !== null) {
      setFilterStatus(Number(statusParam));
    }
  }, [searchParams]);

  useEffect(() => {
    loadMessages();
  }, [pagination.page, pagination.size, filterStatus]);

  const loadMessages = () => {
    setLoading(true);
    getMessages(pagination.page, pagination.size, filterStatus)
      .then((data) => {
        let list = data.list || [];
        if (searchKeyword.trim()) {
          const keyword = searchKeyword.toLowerCase();
          list = list.filter((msg: Message) =>
            (msg.name?.toLowerCase().includes(keyword)) ||
            (msg.phone?.toLowerCase().includes(keyword)) ||
            (msg.content?.toLowerCase().includes(keyword))
          );
        }
        setMessages(list);
        setPagination(prev => ({ ...prev, total: searchKeyword.trim() ? list.length : data.total || 0 }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadMessages();
  };

  const handleView = (message: Message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
  };

  const handleToggleStatus = (message: Message) => {
    const newStatus = message.status === 1 ? 0 : 1;
    updateMessageStatus(message.id, newStatus).then(() => {
      toast.success(newStatus === 1 ? '已标记为已处理' : '已标记为未处理');
      loadMessages();
    });
  };

  const handleDelete = (id: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这条留言吗？',
      onConfirm: () => {
        deleteMessage(id).then(() => {
          toast.success('留言已删除');
          loadMessages();
        });
        setConfirmConfig(null);
      }
    });
  };

  const handleClearAll = () => {
    clearAllMessages().then(() => {
      toast.success('所有留言已清空');
      loadMessages();
      setShowClearModal(false);
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterButtons = [
    { label: '全部', value: undefined, icon: 'all' },
    { label: '未处理', value: 0, icon: 'pending' },
    { label: '已处理', value: 1, icon: 'done' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      {/* 操作栏 - 搜索 + 状态筛选 */}
      <div className="mb-4 shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索姓名、电话或留言内容..."
                  className="w-full px-4 py-2.5 pl-10 rounded-lg text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                />
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchKeyword && (
                  <button
                    onClick={() => { setSearchKeyword(''); setPagination(prev => ({ ...prev, page: 1 })); loadMessages(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-8 bg-slate-200"></div>

            {/* 状态筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">状态：</span>
              {filterButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    setFilterStatus(btn.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === btn.value
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 列表区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                <span className="text-slate-500">加载中...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-slate-600 font-medium">暂无留言</p>
                  <p className="text-sm text-slate-400 mt-1">当前筛选条件下没有找到留言记录</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 表格 */}
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">姓名</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">联系方式</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">留言内容</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">提交时间</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {messages.map((message) => (
                      <tr key={message.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-slate-800 font-medium">{message.name || <span className="text-slate-400">未填写</span>}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600">{message.phone || <span className="text-slate-400">未填写</span>}</span>
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="group/item relative">
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                              {message.content || <span className="text-slate-400">无内容</span>}
                            </p>
                            {message.content && message.content.length > 50 && (
                              <div className="invisible group-hover/item:visible absolute left-0 top-full mt-2 z-20 bg-slate-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl max-w-sm whitespace-pre-wrap">
                                {message.content}
                                <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-900 rotate-45"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            message.status === 1
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          }`}>
                            {message.status === 1 ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            )}
                            {message.status === 1 ? '已处理' : '未处理'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">{formatDate(message.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleView(message)}
                              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="查看详情"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(message)}
                              className={`p-2 rounded-lg transition-colors ${
                                message.status === 1
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-amber-600 hover:bg-amber-50'
                              }`}
                              title={message.status === 1 ? '标记为未处理' : '标记为已处理'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {message.status === 1 ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(message.id)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  共 <span className="font-semibold text-slate-700">{pagination.total}</span> 条记录
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={pagination.size}
                    onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value), page: 1 }))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value={10}>10 条/页</option>
                    <option value={20}>20 条/页</option>
                    <option value={50}>50 条/页</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                    >
                      上一页
                    </button>
                    <span className="px-4 py-1.5 text-sm text-slate-700 font-medium bg-slate-100 rounded-lg">
                      {pagination.page}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">留言详情</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">姓名</p>
                  <p className="text-slate-800 font-medium">{selectedMessage.name || <span className="text-slate-400 italic">未填写</span>}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">联系方式</p>
                  <p className="text-slate-800 font-medium">{selectedMessage.phone || <span className="text-slate-400 italic">未填写</span>}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">留言内容</p>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedMessage.content || <span className="text-slate-400 italic">无内容</span>}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">提交时间</p>
                  <p className="text-slate-800">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">处理状态</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMessage.status === 1
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedMessage.status === 1 ? '已处理' : '未处理'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedMessage);
                  setShowDetailModal(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMessage.status === 1
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {selectedMessage.status === 1 ? '标记为未处理' : '标记为已处理'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认删除弹窗 */}
      {confirmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmConfig(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.542 0 2.602-1.654 2.39-3.154l-.632-3.632a2 2 0 00-2-1.654H6.684a2 2 0 00-2 1.654l-.632 3.632c-.212 1.5.848 3.154 2.39 3.154z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{confirmConfig.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{confirmConfig.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmConfig(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 清空所有弹窗 */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowClearModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.542 0 2.602-1.654 2.39-3.154l-.632-3.632a2 2 0 00-2-1.654H6.684a2 2 0 00-2 1.654l-.632 3.632c-.212 1.5.848 3.154 2.39 3.154z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">清空所有留言</h3>
                <p className="text-sm text-slate-500 mt-1">此操作将删除所有留言记录，且不可恢复。</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;