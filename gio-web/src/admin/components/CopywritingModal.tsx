import { useState, useEffect, useRef } from 'react';
import { Copywriting, CopywritingCreateRequest, generateFreeCopywritingStream } from '@/services/copywriting';
import { toast } from 'sonner';

interface CopywritingModalProps {
  copywriting: Copywriting | null;
  visible: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  projectId?: number; // 可选：传入项目 ID 时自动选择该项目
  projectName?: string;
}

interface StyleOption {
  value: string;
  label: string;
  icon: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { value: 'professional', label: '专业权威', icon: '💼' },
  { value: 'seed', label: '热情种草', icon: '🌱' },
  { value: 'story', label: '叙事性', icon: '📖' },
  { value: 'minimal', label: '简洁克制', icon: '✨' }
];

const CopywritingModal: React.FC<CopywritingModalProps> = ({
  copywriting,
  visible,
  onClose,
  onSaveSuccess,
  projectId: initialProjectId,
  projectName
}) => {
  // 模式选择：1-从项目生成 2-自由创作
  const [sourceType, setSourceType] = useState<number>(copywriting?.sourceType || (initialProjectId ? 1 : 1));

  // 从项目生成相关状态
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(initialProjectId || null);
  const [projectList, setProjectList] = useState<{ id: number; name: string }[]>([]);

  // 自由创作相关状态
  const [customDescription, setCustomDescription] = useState('');

  // 通用状态
  const [selectedStyle, setSelectedStyle] = useState<string>('professional');
  const [generating, setGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [generationComplete, setGenerationComplete] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tagsStr: '',
    status: 0
  });

  const contentEndRef = useRef<HTMLDivElement>(null);

  // 加载项目列表
  useEffect(() => {
    if (visible && !copywriting && sourceType === 1) {
      fetchProjects();
    }
  }, [visible, copywriting, sourceType]);

  // 编辑模式：填充表单
  useEffect(() => {
    if (copywriting) {
      setSourceType(copywriting.sourceType);
      setSelectedProjectId(copywriting.projectId || initialProjectId || null);
      setCustomDescription(copywriting.customDescription || '');
      setSelectedStyle(copywriting.style);
      setFormData({
        title: copywriting.title,
        content: copywriting.content,
        tagsStr: Array.isArray(copywriting.tags) ? copywriting.tags.join(', ') : copywriting.tags || '',
        status: copywriting.status
      });
    } else {
      // 新建模式：重置
      setFormData({ title: '', content: '', tagsStr: '', status: 0 });
      setStreamingContent('');
      setGenerationComplete(false);
    }
  }, [copywriting, initialProjectId]);

  // 滚动到底部
  useEffect(() => {
    if (generating && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamingContent, generating]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects?page=1&size=100', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const result = await response.json();
      if (result.data?.list) {
        setProjectList(result.data.list.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (error) {
      // 获取项目列表失败
    }
  };

  // 解析流式内容为 JSON
  const parseStreamingContent = (raw: string): { title: string; content: string; tags: string[] } => {
    if (!raw) return { title: '', content: '', tags: [] };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[0]);
        return {
          title: json.title || '',
          content: json.content || '',
          tags: Array.isArray(json.tags) ? json.tags : []
        };
      }
    } catch (e) {
      // 解析失败
    }
    return { title: '', content: raw, tags: [] };
  };

  // 生成完成后解析并填充表单
  useEffect(() => {
    if (generationComplete && streamingContent) {
      const parsed = parseStreamingContent(streamingContent);
      if (parsed.title || parsed.content) {
        setFormData({
          title: parsed.title || '',
          content: parsed.content || '',
          tagsStr: parsed.tags?.length ? parsed.tags.join(', ') : '',
          status: 0
        });
        toast.success('文案生成成功，请查看并编辑');
      }
    }
  }, [generationComplete, streamingContent]);

  const handleGenerate = async () => {
    if (sourceType === 1 && !selectedProjectId && !initialProjectId) {
      toast.error('请选择一个项目');
      return;
    }
    if (sourceType === 2 && !customDescription.trim()) {
      toast.error('请填写项目描述');
      return;
    }

    setGenerating(true);
    setStreamingContent('');
    setGenerationComplete(false);

    try {
      if (sourceType === 1 && (initialProjectId || selectedProjectId)) {
        // 从项目生成
        await callProjectGenerate(initialProjectId || selectedProjectId!, selectedStyle);
      } else {
        // 自由创作
        await generateFreeCopywritingStream(
          { customImages: '[]', description: customDescription, style: selectedStyle },
          (content) => setStreamingContent(content)
        );
      }
      setGenerationComplete(true);
    } catch (error: any) {
      toast.error('生成失败：' + (error.message || '请稍后重试'));
    } finally {
      setGenerating(false);
    }
  };

  const callProjectGenerate = async (projectId: number, style: string) => {
    const token = localStorage.getItem('admin_token');
    const url = `/api/admin/projects/${projectId}/ai-copywriting/stream`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ style })
    });

    if (!response.ok) throw new Error('请求失败');

    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法获取响应流');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      buffer += chunk;

      // 按行分割处理 SSE 事件
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 最后一行可能不完整，保留到下一次

      let currentEvent: string | null = null;

      for (const line of lines) {
        const trimmedLine = line.trim();

        // 跳过空行和注释
        if (!trimmedLine || trimmedLine.startsWith(':')) continue;

        // 解析 event 行
        if (trimmedLine.startsWith('event:')) {
          currentEvent = trimmedLine.substring(6).trim();
          continue;
        }

        // 解析 data 行
        if (trimmedLine.startsWith('data:')) {
          const data = trimmedLine.substring(5).trimStart();

          if (data === '[DONE]') continue;

          if (currentEvent === 'content') {
            // 累积增量内容
            accumulatedContent += data;
            setStreamingContent(accumulatedContent);
          } else if (currentEvent === 'complete') {
            // 完整内容，直接替换
            setStreamingContent(data);
          } else if (currentEvent === 'error') {
            try {
              const error = JSON.parse(data);
              throw new Error(error.error || '生成失败');
            } catch (e: any) {
              throw new Error(e.message || '生成失败');
            }
          } else {
            // 没有 event 字段，直接累积（兼容旧格式）
            accumulatedContent += data;
            setStreamingContent(accumulatedContent);
          }
        }
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('请填写标题');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('请填写正文');
      return;
    }

    try {
      const tagsArray = formData.tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean);
      const requestData: CopywritingCreateRequest = {
        projectId: sourceType === 1 ? selectedProjectId || undefined : undefined,
        title: formData.title,
        content: formData.content,
        tags: JSON.stringify(tagsArray),
        style: selectedStyle,
        sourceType,
        customImages: sourceType === 2 ? '[]' : undefined,
        customDescription: sourceType === 2 ? customDescription : undefined,
        status: formData.status
      };

      const url = copywriting ? `/api/admin/copywritings/${copywriting.id}` : '/api/admin/copywritings';
      const method = copywriting ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      if (result.code === 200) {
        onSaveSuccess();
      } else {
        toast.error('保存失败：' + (result.message || '请稍后重试'));
      }
    } catch (error: any) {
      toast.error('保存失败：' + error.message);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {copywriting ? '编辑推文' : '新建推文'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {copywriting ? '修改推文内容' : 'AI 一键生成小红书文案'}
            </p>
          </div>
          <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 主体内容 - 左右分栏 */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* 左侧：配置区 */}
          <div className="w-72 border-r border-slate-200 bg-slate-50 p-5 overflow-y-auto shrink-0">
            {!copywriting && (
              <>
                {/* 生成模式 */}
                {!initialProjectId && (
                  <div className="mb-5">
                    <label className="text-sm font-medium text-slate-600 mb-2 block">生成方式</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSourceType(1); setSelectedProjectId(null); }}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sourceType === 1
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        📁 项目生成
                      </button>
                      <button
                        onClick={() => { setSourceType(2); setCustomDescription(''); }}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sourceType === 2
                            ? 'bg-emerald-500 text-white shadow'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        🎨 自由创作
                      </button>
                    </div>
                  </div>
                )}

                {sourceType === 1 ? (
                  <div className="mb-5">
                    {initialProjectId ? (
                      <>
                        <label className="text-sm font-medium text-slate-600 mb-2 block">当前项目</label>
                        <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {projectName || '当前项目'}
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="text-sm font-medium text-slate-600 mb-2 block">选择项目</label>
                        <select
                          value={selectedProjectId || ''}
                          onChange={(e) => setSelectedProjectId(Number(e.target.value) || null)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                        >
                          <option value="">请选择...</option>
                          {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-5">
                    <label className="text-sm font-medium text-slate-600 mb-2 block">项目描述</label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="描述项目特点、风格、亮点等..."
                      rows={4}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none"
                    />
                  </div>
                )}
              </>
            )}

            {/* 文案风格 */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">文案风格</label>
              <div className="space-y-2">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all flex items-center gap-2 ${
                      selectedStyle === style.value
                        ? 'bg-emerald-500 text-white shadow'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">{style.icon}</span>
                    <span className="font-medium">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={generating || (!copywriting && !initialProjectId && sourceType === 1 && !selectedProjectId) || (!copywriting && sourceType === 2 && !customDescription.trim())}
              className="w-full mt-5 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {streamingContent ? '重新生成' : '开始生成'}
                </>
              )}
            </button>
          </div>

          {/* 右侧：编辑区 */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {generating || streamingContent ? (
              /* 生成中或已生成内容 */
              <div className="space-y-4">
                {/* 生成进度 */}
                {generating && (
                  <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-lg">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-medium">AI 正在创作中...</span>
                  </div>
                )}

                {/* 原始内容显示区 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      AI 生成内容
                    </h3>
                    {generationComplete && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        生成完成
                      </span>
                    )}
                  </div>
                  <div className="bg-white border border-slate-100 rounded-lg p-4 max-h-96 overflow-y-auto text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">
                    {streamingContent}
                    <div ref={contentEndRef} />
                  </div>
                </div>

                {/* 生成完成后的操作按钮 */}
                {generationComplete && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      重新生成
                    </button>
                    <button
                      onClick={() => {
                        const parsed = parseStreamingContent(streamingContent);
                        setFormData({
                          title: parsed.title || '',
                          content: parsed.content || '',
                          tagsStr: parsed.tags?.length ? parsed.tags.join(', ') : '',
                          status: 0
                        });
                        setStreamingContent('');
                        setGenerationComplete(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all text-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      填充到表单
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 表单编辑区 */
              <div className="max-w-3xl mx-auto space-y-4">
                {/* AI 生成提示 */}
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">需要 AI 帮忙吗？</p>
                      <p className="text-xs text-purple-600">先在左侧选择风格，点击生成按钮</p>
                    </div>
                  </div>
                </div>

                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                    placeholder="请输入标题（建议 15-25 字）"
                  />
                </div>

                {/* 正文 */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">正文</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all resize-none leading-relaxed"
                    placeholder="请输入正文内容（建议 200-400 字）"
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">{formData.content.length} 字</div>
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">标签</label>
                  <input
                    type="text"
                    value={formData.tagsStr}
                    onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                    placeholder="用逗号分隔，如：室内设计，装修灵感，极简主义"
                  />
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">状态</label>
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作栏 - 生成中或已生成但未填充时隐藏 */}
        {(!streamingContent || generationComplete === false) && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button onClick={() => onClose()} className="px-5 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-white transition-all">
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title || !formData.content}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              {copywriting ? '保存修改' : '保存推文'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopywritingModal;
