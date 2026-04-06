import { useState, useRef } from 'react';
import { generateAiCopywritingStream, AiCopywritingResponse } from '@/services/ai';
import { toast } from 'sonner';

interface AiCopywritingModalProps {
  projectId: number;
  projectName: string;
  visible: boolean;
  onClose: () => void;
  onGenerated?: (result: AiCopywritingResponse) => void;
  onApply?: (content: string) => void;
}

interface StyleOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  gradient: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    value: 'professional',
    label: '专业权威',
    description: '突出设计奖项、技术亮点，语言严谨有深度',
    icon: '💼',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    value: 'seed',
    label: '热情种草',
    description: '多用感叹句和 emoji，营造强烈推荐感',
    icon: '🌱',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    value: 'story',
    label: '叙事性',
    description: '从业主需求或设计挑战切入，有故事感',
    icon: '📖',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    value: 'minimal',
    label: '简洁克制',
    description: '用最少文字传递核心信息，留白有格调',
    icon: '✨',
    gradient: 'from-purple-500 to-pink-600'
  }
];

const AiCopywritingModal: React.FC<AiCopywritingModalProps> = ({
  projectId,
  projectName,
  visible,
  onClose,
  onGenerated,
  onApply
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('professional');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<AiCopywritingResponse | null>(null);
  const [copiedField, setCopiedField] = useState<'title' | 'content' | 'tags' | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  const handleGenerate = async () => {
    setGenerating(true);
    setStreamingContent('');
    try {
      const response = await generateAiCopywritingStream(
        projectId,
        selectedStyle,
        (content) => {
          // 直接设置累积内容
          setStreamingContent(content);
        }
      );
      setResult(response);
      toast.success('文案生成成功');
      onGenerated?.(response);
    } catch (error: any) {
      toast.error('文案生成失败：' + (error.message || '请稍后重试'));
    } finally {
      setGenerating(false);
    }
  };

  // 缓存已解析的内容，避免重新解析时丢失
  const parsedCacheRef = useRef<{ title: string; content: string; tags: string[] } | null>(null);

  const handleCopy = async (text: string, field: 'title' | 'content' | 'tags') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const handleClose = () => {
    setResult(null);
    setStreamingContent('');
    setSelectedStyle('professional');
    onClose();
  };

  const handleApplyContent = () => {
    const contentToApply = result?.content || streamingContent;
    if (contentToApply && onApply) {
      onApply(contentToApply);
    }
  };

  if (!visible) return null;

  // 解析流式内容用于展示（处理 AI 返回的 Thinking Process + JSON 格式）
  const parseStreamingContent = (raw: string) => {
    if (!raw) return { title: '', content: '', tags: [] as string[] };

    // 1. 先尝试找到完整的 JSON 对象（排除 Thinking Process）
    try {
      // 找到最后一个 JSON 对象（在 Thinking Process 之后）
      let jsonStartIndex = raw.lastIndexOf('{\n  "title"');
      if (jsonStartIndex === -1) {
        // 尝试找任意包含 title 的 JSON
        jsonStartIndex = raw.indexOf('{"title"');
        if (jsonStartIndex === -1) {
          // 再尝试找第一个 {
          jsonStartIndex = raw.indexOf('{');
          if (jsonStartIndex >= 0) {
            const jsonEndIndex = raw.lastIndexOf('}');
            if (jsonEndIndex > jsonStartIndex) {
              let jsonStr = raw.substring(jsonStartIndex, jsonEndIndex + 1);
              const json = JSON.parse(jsonStr);
              // 如果解析出来的是 {fullContent: "..."}，继续解析内部
              if (json.fullContent && typeof json.fullContent === 'string') {
                return parseStreamingContent(json.fullContent);
              }
              const result = {
                title: json.title || '',
                content: json.content || '',
                tags: Array.isArray(json.tags) ? json.tags : []
              };
              parsedCacheRef.current = result;
              return result;
            }
          }
        }
      }

      if (jsonStartIndex >= 0) {
        const jsonEndIndex = raw.lastIndexOf('}');
        if (jsonEndIndex > jsonStartIndex) {
          let jsonStr = raw.substring(jsonStartIndex, jsonEndIndex + 1);
          const json = JSON.parse(jsonStr);
          const result = {
            title: json.title || '',
            content: json.content || '',
            tags: Array.isArray(json.tags) ? json.tags : []
          };
          parsedCacheRef.current = result;
          return result;
        }
      }
    } catch (e) {
      // 完整 JSON 解析失败，继续下面的逐字段提取
    }

    // 2. 逐字段提取 - 使用更健壮的正则表达式
    // 提取 title
    let extractedTitle = '';
    const titleRegex = /"title"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    const titleMatch = raw.match(titleRegex);
    if (titleMatch && titleMatch[1]) {
      extractedTitle = unescapeJsonString(titleMatch[1]);
    }

    // 提取 content - 使用更精确的匹配
    let extractedContent = '';
    const contentRegex = /"content"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    const contentMatch = raw.match(contentRegex);
    if (contentMatch && contentMatch[1]) {
      extractedContent = unescapeJsonString(contentMatch[1]);
    }

    // 提取 tags 数组
    let extractedTags: string[] = [];
    const tagsRegex = /"tags"\s*:\s*\[([^\]]*)\]/;
    const tagsMatch = raw.match(tagsRegex);
    if (tagsMatch && tagsMatch[1]) {
      const tagItemsRegex = /"((?:[^"\\]|\\.)*)"/g;
      let tagMatch;
      while ((tagMatch = tagItemsRegex.exec(tagsMatch[1])) !== null) {
        extractedTags.push(unescapeJsonString(tagMatch[1]));
      }
    }

    // 3. 如果有提取到内容，使用新内容；否则使用缓存
    const result = {
      title: extractedTitle || parsedCacheRef.current?.title || '',
      content: extractedContent || parsedCacheRef.current?.content || '',
      tags: extractedTags.length > 0 ? extractedTags : parsedCacheRef.current?.tags || []
    };

    // 更新缓存
    if (extractedTitle || extractedContent || extractedTags.length > 0) {
      parsedCacheRef.current = result;
    }

    return result;
  };

  // 辅助函数：转义 JSON 字符串
  const unescapeJsonString = (str: string): string => {
    return str
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\\\/g, '\\');
  };

  const displayContent = result || parseStreamingContent(streamingContent);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl font-bold text-slate-800">AI 一键生成小红书文案</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              为「<span className="font-medium text-slate-700">{projectName}</span>」创作内容
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all p-2.5 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 - 左右分栏布局 */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* 左侧：风格选择（生成前）/ 生成控制 */}
          <div className="lg:w-80 xl:w-96 border-r border-slate-200 bg-slate-50/50 overflow-y-auto shrink-0">
            <div className="p-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                选择文案风格
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                      selectedStyle === style.value
                        ? `border-transparent bg-gradient-to-br ${style.gradient} text-white shadow-lg shadow-${style.value === 'professional' ? 'blue' : style.value === 'seed' ? 'green' : style.value === 'story' ? 'amber' : 'purple'}-200`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${selectedStyle === style.value ? 'brightness-125' : ''}`}>{style.icon}</div>
                    <div className={`font-semibold ${selectedStyle === style.value ? 'text-white' : 'text-slate-800'}`}>{style.label}</div>
                    <div className={`text-xs mt-1 ${selectedStyle === style.value ? 'text-white/80' : 'text-slate-500'}`}>{style.description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleClose}
                  disabled={generating}
                  className="px-5 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={`px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 ${
                    generating ? '' : 'hover:from-emerald-600 hover:to-teal-600'
                  }`}
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI 创作中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      开始生成
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：内容展示区 */}
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {!result && !streamingContent ? (
              /* 空状态 */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">准备就绪</h3>
                  <p className="text-slate-500 mb-6">选择左侧的文案风格，点击"开始生成"按钮，AI 将自动为您创作小红书文案</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      15-25 字标题
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      200-400 字正文
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      5-10 个标签
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* 生成结果展示 */
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* 顶部标签页 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'preview'
                          ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      👁 预览模式
                    </button>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'edit'
                          ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      ✏ 编辑模式
                    </button>
                  </div>
                  {generating && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI 正在创作中...
                    </div>
                  )}
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* 标题卡片 */}
                    <div className={`rounded-2xl p-5 border-2 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📝</span>
                          <label className="text-sm font-semibold text-slate-600">文案标题</label>
                        </div>
                        <button
                          onClick={() => handleCopy(displayContent.title, 'title')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                            copiedField === 'title'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {copiedField === 'title' ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              已复制
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              复制
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-lg font-medium text-slate-800 leading-relaxed min-h-[1.75rem]">
                        {displayContent.title || (
                          <span className="text-slate-400 animate-pulse">AI 正在思考标题...</span>
                        )}
                      </p>
                    </div>

                    {/* 正文卡片 */}
                    <div className={`rounded-2xl p-5 border-2 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-white border-slate-200'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <label className="text-sm font-semibold text-slate-600">文案正文</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{displayContent.content.length} 字</span>
                          <button
                            onClick={() => handleCopy(displayContent.content, 'content')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                              copiedField === 'content'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {copiedField === 'content' ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                已复制
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                复制
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {activeTab === 'preview' ? (
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                            {displayContent.content || (
                              <span className="text-slate-400 animate-pulse">AI 正在撰写正文内容，请稍候...</span>
                            )}
                          </p>
                        </div>
                      ) : (
                        <textarea
                          value={displayContent.content}
                          onChange={(e) => {
                            if (result) {
                              setResult({ ...result, content: e.target.value });
                            }
                          }}
                          readOnly={!result && !streamingContent}
                          className="w-full h-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all resize-none text-base leading-relaxed"
                          placeholder={generating ? '' : '暂无内容'}
                        />
                      )}
                    </div>

                    {/* 标签卡片 */}
                    <div className={`rounded-2xl p-5 border-2 transition-all ${
                      activeTab === 'preview'
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏷</span>
                          <label className="text-sm font-semibold text-slate-600">推荐标签</label>
                        </div>
                        <button
                          onClick={() => handleCopy(displayContent.tags.join(' '), 'tags')}
                          disabled={displayContent.tags.length === 0}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                            copiedField === 'tags'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {copiedField === 'tags' ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              已复制
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              复制
                            </>
                          )}
                        </button>
                      </div>
                      {displayContent.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {displayContent.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-white text-purple-700 rounded-full text-sm font-medium border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition-all cursor-default"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 animate-pulse">
                          {generating ? 'AI 正在生成标签...' : '暂无标签'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 底部操作栏 */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => {
                      setResult(null);
                      setStreamingContent('');
                      setGenerating(false);
                    }}
                    disabled={generating}
                    className="text-slate-600 hover:text-slate-800 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重新选择风格
                  </button>
                  <div className="flex items-center gap-3">
                    {result && onApply && (
                      <button
                        onClick={handleApplyContent}
                        className="px-5 py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        应用到项目描述
                      </button>
                    )}
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      重新生成
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCopywritingModal;
