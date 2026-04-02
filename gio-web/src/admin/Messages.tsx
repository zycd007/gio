import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage, clearAllMessages } from '@/services/admin';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
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

  useEffect(() => {
    loadMessages();
  }, [pagination.page, pagination.size, filterStatus]);

  const loadMessages = () => {
    setLoading(true);
    getMessages(pagination.page, pagination.size, filterStatus)
      .then((data) => {
        setMessages(data.list || []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 查看详情
  const handleView = (message: Message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
  };

  // 标记为已处理/未处理
  const handleToggleStatus = (message: Message) => {
    const newStatus = message.status === 1 ? 0 : 1;
    updateMessageStatus(message.id, newStatus).then(() => {
      toast.success(newStatus === 1 ? '已标记为已处理' : '已标记为未处理');
      loadMessages();
    });
  };

  // 删除留言
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

  // 清空所有留言
  const handleClearAll = () => {
    clearAllMessages().then(() => {
      toast.success('所有留言已清空');
      loadMessages();
      setShowClearModal(false);
    });
  };

  // 格式化日期
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

  // 筛选按钮样式
  const filterButtons = [
    { label: '全部', value: undefined },
    { label: '未处理', value: 0 },
    { label: '已处理', value: 1 },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                setFilterStatus(btn.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === btn.value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {pagination.total > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-all"
          >
            清空所有
          </button>
        )}
      </div>

      {/* 列表 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-600 mt-2">加载中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-600 mt-2">暂无留言</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">姓名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">联系方式</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">留言内容</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">提交时间</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((message) => (
                <tr key={message.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800">{message.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{message.phone || '-'}</td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {message.content}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      message.status === 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {message.status === 1 ? '已处理' : '未处理'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{formatDate(message.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(message)}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleToggleStatus(message)}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {message.status === 1 ? '标记未处理' : '标记已处理'}
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 分页 */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-sm text-slate-600">
            共 <span className="font-medium text-slate-700">{pagination.total}</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pagination.size}
              onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value), page: 1 }))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-3 py-1.5 text-sm text-slate-600 font-medium">
              {pagination.page} / {Math.ceil(pagination.total / pagination.size)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">留言详情</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">姓名</label>
                <p className="text-slate-800 mt-1">{selectedMessage.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">联系方式</label>
                <p className="text-slate-800 mt-1">{selectedMessage.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">留言内容</label>
                <p className="text-slate-800 mt-1 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">提交时间</label>
                <p className="text-slate-800 mt-1">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">状态</label>
                <p className="text-slate-800 mt-1">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.status === 1
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedMessage.status === 1 ? '已处理' : '未处理'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedMessage);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors"
              >
                {selectedMessage.status === 1 ? '标记为未处理' : '标记为已处理'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认弹窗 */}
      {confirmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmConfig(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{confirmConfig.title}</h2>
            <p className="text-slate-600 mb-6">{confirmConfig.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmConfig(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 清空所有弹窗 */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowClearModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">清空所有留言</h2>
            <p className="text-slate-600 mb-6">确定要清空所有留言吗？此操作不可恢复。</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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