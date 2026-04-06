import { Copywriting } from '@/services/copywriting';
import { toast } from 'sonner';

interface CopywritingDetailModalProps {
  copywriting: Copywriting;
  visible: boolean;
  onClose: () => void;
}

const CopywritingDetailModal: React.FC<CopywritingDetailModalProps> = ({
  copywriting,
  visible,
  onClose
}) => {
  if (!visible) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`已复制${label}`);
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const handleCopyAll = async () => {
    const fullContent = `${copywriting.title}\n\n${copywriting.content}\n\n${copywriting.tags.map(t => `#${t}`).join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullContent);
      toast.success('已复制完整文案');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">推文详情</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {copywriting.projectName ? `关联项目：${copywriting.projectName}` : '自由创作'}
            </p>
          </div>
          <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 基本信息卡片 */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400">来源</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">
                {copywriting.sourceType === 1 ? '项目生成' : '自由创作'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400">风格</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">{copywriting.styleName || copywriting.style}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400">状态</div>
              <div className={`text-sm font-medium mt-0.5 inline-block px-2 py-0.5 rounded ${
                copywriting.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {copywriting.status === 1 ? '已发布' : '草稿'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400">创建时间</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">
                {new Date(copywriting.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>

          {/* 标题 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">标题</label>
              <button
                onClick={() => handleCopy(copywriting.title, '标题')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-slate-800 font-medium leading-relaxed">{copywriting.title}</p>
            </div>
          </div>

          {/* 正文 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">正文</label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{copywriting.content.length} 字</span>
                <button
                  onClick={() => handleCopy(copywriting.content, '正文')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{copywriting.content}</p>
            </div>
          </div>

          {/* 标签 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">标签</label>
              <button
                onClick={() => handleCopy(copywriting.tags.join(' '), '标签')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {copywriting.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            更新于 {new Date(copywriting.updatedAt).toLocaleString('zh-CN')}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-white border-2 border-emerald-500 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制全部
            </button>
            <button
              onClick={() => onClose()}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingDetailModal;
