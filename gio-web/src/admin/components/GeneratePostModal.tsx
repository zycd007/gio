import { useState, useEffect } from 'react';
import { getProjects, getProjectImages, ProjectImage } from '@/services/admin';
import { generatePost, generateAiImages, deleteAiImage } from '@/services/socialPost';
import { SocialPost, AiImageInfo } from '@/types/socialPost';

interface GeneratePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (post: SocialPost) => void;
}

type Step = 1 | 2 | 3 | 4;
type Mode = 'project' | 'custom';

const GeneratePostModal: React.FC<GeneratePostModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<Mode>('project');

  // 项目列表数据
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  // 自定义模式数据
  const [customContent, setCustomContent] = useState('');

  // AI配图相关状态
  const [enableAiImage, setEnableAiImage] = useState(false);
  const [aiImageCount, setAiImageCount] = useState(3);
  const [aiImageStyle, setAiImageStyle] = useState('');
  const [aiImageGenerating, setAiImageGenerating] = useState(false);
  const [aiImages, setAiImages] = useState<AiImageInfo[]>([]);
  const [aiImageProgress, setAiImageProgress] = useState({ completed: 0, total: 0 });

  // 生成结果
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null);

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);

  // 加载项目列表
  useEffect(() => {
    if (visible && mode === 'project') {
      setProjectsLoading(true);
      getProjects(1, 100)
        .then(res => {
          setProjects(res.list.map(p => ({ id: p.id, name: p.name })));
        })
        .finally(() => setProjectsLoading(false));
    }
  }, [visible, mode]);

  // 加载项目图片
  useEffect(() => {
    if (selectedProjectId) {
      setImagesLoading(true);
      getProjectImages(selectedProjectId)
        .then(res => {
          setProjectImages(res);
        })
        .finally(() => setImagesLoading(false));
    } else {
      setProjectImages([]);
    }
  }, [selectedProjectId]);

  // 重置状态
  const resetState = () => {
    setStep(1);
    setMode('project');
    setSelectedProjectId(null);
    setProjectImages([]);
    setSelectedImages([]);
    setCustomContent('');
    setEnableAiImage(false);
    setAiImageCount(3);
    setAiImageStyle('');
    setAiImageGenerating(false);
    setAiImages([]);
    setAiImageProgress({ completed: 0, total: 0 });
    setGeneratedPost(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // 选择图片
  const toggleImage = (imageId: number) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  // 开始生成文案
  const handleGenerate = async () => {
    // 验证必填项
    if (mode === 'project') {
      if (!selectedProjectId) {
        alert('请选择项目');
        return;
      }
      if (selectedImages.length === 0 && !enableAiImage) {
        alert('请选择至少一张图片或启用AI配图');
        return;
      }
    } else {
      if (!customContent.trim()) {
        alert('请输入描述内容');
        return;
      }
    }

    setStep(3);
    setLoading(true);

    try {
      const requestData = mode === 'project'
        ? {
            type: 'project' as const,
            projectId: selectedProjectId!,
            selectedImageIds: selectedImages
          }
        : {
            type: 'custom' as const,
            customContent
          };

      const result = await generatePost(requestData);
      setGeneratedPost(result);
      setStep(4);

      // 如果启用了AI配图，自动开始生成
      if (enableAiImage && result.id) {
        handleGenerateAiImages(result.id, result.title, result.content);
      }
    } catch (error) {
      console.error('生成推文失败:', error);
      alert('生成推文失败，请重试');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // 生成AI配图
  const handleGenerateAiImages = async (postId: number, _title: string, _content: string) => {
    if (!postId) return;

    setAiImageGenerating(true);
    setAiImageProgress({ completed: 0, total: aiImageCount });

    try {
      const response = await generateAiImages(postId, {
        imageCount: aiImageCount,
        stylePrompt: aiImageStyle || undefined
      });

      if (response.images) {
        setAiImages(response.images);
        setAiImageProgress({ completed: response.completedCount, total: response.totalCount });
      }
    } catch (error) {
      console.error('AI配图生成失败:', error);
      alert('AI配图生成失败，请重试');
    } finally {
      setAiImageGenerating(false);
    }
  };

  // 删除单张AI配图
  const handleDeleteAiImage = async (attachmentId: number) => {
    if (!generatedPost?.id) return;

    try {
      await deleteAiImage(generatedPost.id, attachmentId);
      setAiImages(prev => prev.filter(img => img.attachmentId !== attachmentId));
    } catch (error) {
      console.error('删除AI配图失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 复制文案
  const handleCopy = async () => {
    if (!generatedPost) return;

    const text = `${generatedPost.title}\n\n${generatedPost.content}\n\n${generatedPost.tags}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('复制成功！');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请重试');
    }
  };

  // 保存并关闭
  const handleSave = () => {
    if (generatedPost && onSuccess) {
      // 将 AI 配图信息附加到 post
      const postWithAiImages = {
        ...generatedPost,
        aiImages: aiImages
      };
      onSuccess(postWithAiImages);
    }
    handleClose();
  };

  // 进入下一步
  const goToStep2 = () => {
    setStep(2);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{ maxHeight: '100vh' }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">生成推文</h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 && '选择来源类型'}
              {step === 2 && (mode === 'project' ? '选择项目图片和配图选项' : '输入内容描述和配图选项')}
              {step === 3 && 'AI 正在生成中'}
              {step === 4 && '生成完成'}
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

        {/* 步骤指示器 */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      step > s ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-8" style={{ maxHeight: '60vh' }}>
          {/* 步骤1：选择模式 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-6">请选择推文生成方式：</p>
              <div
                onClick={() => setMode('project')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'project'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    mode === 'project' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">从项目生成</h3>
                    <p className="text-sm text-slate-500">基于现有项目内容和图片生成推文</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setMode('custom')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'custom'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    mode === 'custom' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">自定义内容</h3>
                    <p className="text-sm text-slate-500">输入描述内容，AI 自动生成推文</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步骤2：选择详情 */}
          {step === 2 && (
            <div className="space-y-4">
              {mode === 'project' ? (
                <>
                  {/* 项目选择 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">选择项目</label>
                    {projectsLoading ? (
                      <div className="text-center py-4 text-slate-500">加载中...</div>
                    ) : (
                      <select
                        value={selectedProjectId || ''}
                        onChange={(e) => {
                          setSelectedProjectId(e.target.value ? Number(e.target.value) : null);
                          setSelectedImages([]);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-800 bg-white"
                      >
                        <option value="" className="text-slate-500">请选择项目</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id} className="text-slate-800">{p.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* 图片选择 */}
                  {selectedProjectId && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        选择图片（已选 {selectedImages.length} 张）
                      </label>
                      {imagesLoading ? (
                        <div className="text-center py-4 text-slate-500">加载中...</div>
                      ) : (
                        <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                          {projectImages.map(img => (
                            <div
                              key={img.id}
                              onClick={() => toggleImage(img.id)}
                              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                selectedImages.includes(img.id)
                                  ? 'border-emerald-500'
                                  : 'border-transparent hover:border-slate-300'
                              }`}
                            >
                              <img
                                src={`/api/images/${img.id}`}
                                alt={img.imageName}
                                className="w-full h-24 object-cover"
                              />
                              {selectedImages.includes(img.id) && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {img.isCover === 1 && (
                                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                  封面
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* 自定义内容输入 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">描述内容</label>
                    <textarea
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="请描述您想生成的推文内容，例如：介绍一款新灯具产品，强调其简约设计和节能特点..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none resize-none h-40 text-slate-700 bg-white placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              {/* AI配图选项区域 */}
              <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-purple-50/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <label className="text-sm font-medium text-slate-700">AI生成配图</label>
                  </div>
                  <button
                    onClick={() => setEnableAiImage(!enableAiImage)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      enableAiImage ? 'bg-purple-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      enableAiImage ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {enableAiImage && (
                  <div className="space-y-3 pl-7">
                    {/* 配图数量滑块 */}
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">配图数量</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={1}
                          max={9}
                          value={aiImageCount}
                          onChange={(e) => setAiImageCount(Number(e.target.value))}
                          className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="w-8 text-center text-sm font-medium text-purple-600 bg-purple-100 rounded px-2 py-1">
                          {aiImageCount}
                        </span>
                      </div>
                    </div>

                    {/* 风格选择 */}
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">风格偏好（可选）</label>
                      <select
                        value={aiImageStyle}
                        onChange={(e) => setAiImageStyle(e.target.value)}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="">自动匹配文案风格</option>
                        <option value="modern minimalist">现代简约</option>
                        <option value="warm atmosphere">温馨氛围</option>
                        <option value="professional commercial">专业商业</option>
                        <option value="artistic creative">艺术创意</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 步骤3：生成中 */}
          {step === 3 && (
            <div className="py-12 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">AI 正在生成推文</h3>
              <p className="text-slate-500">请稍候，通常需要几秒钟...</p>
              {enableAiImage && (
                <p className="text-sm text-purple-500 mt-2">随后将自动生成 {aiImageCount} 张AI配图</p>
              )}
            </div>
          )}

          {/* 步骤4：生成结果 */}
          {step === 4 && generatedPost && (
            <div className="space-y-4">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">标题</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-semibold">
                  {generatedPost.title}
                </div>
              </div>

              {/* 正文 */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">正文</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700 whitespace-pre-wrap">
                  {generatedPost.content}
                </div>
              </div>

              {/* 标签 */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">标签</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700">
                  {generatedPost.tags}
                </div>
              </div>

              {/* 配图区域 */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">配图</label>
                  <div className="flex gap-2">
                    {selectedImages.length > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        项目图 {selectedImages.length} 张
                      </span>
                    )}
                    {aiImages.length > 0 && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        AI图 {aiImages.length} 张
                      </span>
                    )}
                  </div>
                </div>

                {/* 图片网格 - 混合显示 */}
                {(selectedImages.length > 0 || aiImages.length > 0) && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {/* 项目图片 */}
                    {selectedImages.map(imageId => (
                      <div key={`project-${imageId}`} className="relative rounded-lg overflow-hidden border-2 border-blue-400">
                        <img
                          src={`/api/images/${imageId}`}
                          alt="项目图片"
                          className="w-full h-24 object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          项目图
                        </span>
                      </div>
                    ))}

                    {/* AI配图 */}
                    {aiImages.map((img) => (
                      <div key={`ai-${img.attachmentId}`} className="relative rounded-lg overflow-hidden border-2 border-purple-400">
                        <img
                          src={img.url || `/api/images/${img.attachmentId}`}
                          alt="AI配图"
                          className="w-full h-24 object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded">
                          AI图
                        </span>
                        <button
                          onClick={() => handleDeleteAiImage(img.attachmentId)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI配图生成进度 */}
                {aiImageGenerating && (
                  <div className="mb-3 p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">AI正在生成配图...</span>
                      <span className="text-xs text-purple-500">{aiImageProgress.completed}/{aiImageProgress.total}</span>
                    </div>
                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${(aiImageProgress.completed / aiImageProgress.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-purple-600 mt-2">每张图片约需10-15秒，请耐心等待...</p>
                  </div>
                )}

                {/* 生成/追加AI配图按钮 */}
                {!aiImageGenerating && (aiImages.length === 0 || aiImages.length < 9) && generatedPost.id && (
                  <button
                    onClick={() => handleGenerateAiImages(generatedPost.id!, generatedPost.title, generatedPost.content)}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {aiImages.length === 0 ? '生成AI配图' : '追加生成'}
                  </button>
                )}

                {/* 无配图提示 */}
                {selectedImages.length === 0 && aiImages.length === 0 && !aiImageGenerating && (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    暂无配图，点击上方按钮生成AI配图
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
          {step === 1 && (
            <div />
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              上一步
            </button>
          )}
          {step === 3 && (
            <div />
          )}
          {step === 4 && (
            <button
              onClick={() => {
                setStep(2);
                setAiImages([]);
              }}
              className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              重新生成
            </button>
          )}

          <div className="flex gap-3">
            {step === 1 && (
              <button
                onClick={goToStep2}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200"
              >
                下一步
              </button>
            )}
            {step === 2 && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {loading ? '生成中...' : '开始生成'}
              </button>
            )}
            {step === 4 && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                >
                  复制文案
                </button>
                <button
                  onClick={handleSave}
                  disabled={aiImageGenerating}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                >
                  保存并关闭
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePostModal;