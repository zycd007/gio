import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostDetail, updatePost, deletePost, updatePublishStatus, generateAiImages, deleteAiImage } from '@/services/socialPost';
import { SocialPost, AiImageInfo } from '@/types/socialPost';
import { toast } from 'sonner';

const SocialPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : 0;

  // 页面状态
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 推文数据
  const [post, setPost] = useState<SocialPost | null>(null);

  // 编辑表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });

  // 页面模式
  const [isEditMode, setIsEditMode] = useState(false);

  // 图片预览模态框
  const [previewImage, setPreviewImage] = useState<number | null>(null);

  // AI配图相关
  const [aiImageGenerating, setAiImageGenerating] = useState(false);
  const [aiImageModal, setAiImageModal] = useState<{
    show: boolean;
    count: number;
    style: string;
  } | null>(null);

  // 确认对话框
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // 加载推文详情
  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await getPostDetail(postId);
      setPost(data);
      setFormData({
        title: data.title || '',
        content: data.content || '',
        tags: data.tags || '',
      });
    } catch (err: any) {
      toast.error('加载推文失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 进入编辑模式
  const handleEnterEditMode = () => {
    if (!post) return;
    setFormData({
      title: post.title || '',
      content: post.content || '',
      tags: post.tags || '',
    });
    setIsEditMode(true);
  };

  // 退出编辑模式
  const handleExitEditMode = () => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        tags: post.tags || '',
      });
    }
    setIsEditMode(false);
  };

  // 保存推文
  const handleSave = async () => {
    // 校验
    if (!formData.title.trim()) {
      toast.error('请输入标题');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('请输入正文内容');
      return;
    }

    setSaving(true);
    try {
      await updatePost(postId, formData);
      toast.success('保存成功');
      setIsEditMode(false);
      loadPost();
    } catch (err: any) {
      toast.error('保存失败：' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 复制文案
  const handleCopyContent = async () => {
    const copyText = `#${formData.title}\n\n${formData.content}\n\n${formData.tags}`;
    try {
      await navigator.clipboard.writeText(copyText);
      toast.success('已复制完整文案');
    } catch (err) {
      toast.error('复制失败');
    }
  };

  // 标记为已发布
  const handleMarkAsPublished = async () => {
    try {
      await updatePublishStatus(postId, 1);
      toast.success('已标记为已发布');
      loadPost();
    } catch (err: any) {
      toast.error('操作失败：' + err.message);
    }
  };

  // 删除推文
  const handleDelete = () => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这条推文吗？此操作不可恢复。',
      onConfirm: async () => {
        try {
          await deletePost(postId);
          toast.success('推文已删除');
          navigate('/admin/social-posts');
        } catch (err: any) {
          toast.error('删除失败：' + err.message);
        }
        setConfirmConfig(null);
      },
    });
  };

  // 打开AI配图生成弹窗
  const handleOpenAiImageModal = () => {
    setAiImageModal({
      show: true,
      count: 3,
      style: '',
    });
  };

  // 生成AI配图
  const handleGenerateAiImages = async () => {
    if (!aiImageModal || !postId) return;

    setAiImageGenerating(true);
    setAiImageModal(null);

    try {
      const response = await generateAiImages(postId, {
        imageCount: aiImageModal.count,
        stylePrompt: aiImageModal.style || undefined,
      });

      if (response.status === 2) {
        toast.success(`成功生成 ${response.images?.length || 0} 张AI配图`);
        loadPost(); // 重新加载推文数据
      } else if (response.status === 3) {
        toast.error('AI配图生成失败：' + response.message);
      }
    } catch (err: any) {
      toast.error('AI配图生成失败：' + err.message);
    } finally {
      setAiImageGenerating(false);
    }
  };

  // 删除单张AI配图
  const handleDeleteAiImage = (attachmentId: number) => {
    setConfirmConfig({
      show: true,
      title: '删除AI配图',
      message: '确定要删除这张AI配图吗？',
      onConfirm: async () => {
        try {
          await deleteAiImage(postId, attachmentId);
          toast.success('AI配图已删除');
          loadPost();
        } catch (err: any) {
          toast.error('删除失败：' + err.message);
        }
        setConfirmConfig(null);
      },
    });
  };

  // 加载状态
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 不存在
  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">推文不存在</p>
          <Link
            to="/admin/social-posts"
            className="px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-lg"
          >
            返回推文列表
          </Link>
        </div>
      </div>
    );
  }

  // 计算 AI 配图数量
  const aiImageCount = post.aiImages?.length || 0;
  const projectImageCount = post.selectedImages?.length || 0;
  const totalImageCount = aiImageCount + projectImageCount;

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* 顶部导航栏 */}
      <div
        className={`shrink-0 border-b ${
          isEditMode ? 'bg-blue-50/80 border-blue-200' : 'bg-white/80 border-slate-200'
        } backdrop-blur-sm`}
      >
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/social-posts"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="返回推文列表"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {isEditMode ? '编辑推文' : post.title || '推文详情'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  post.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {post.status === 1 ? '已发布' : '草稿'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {post.type === 'project' ? '项目' : '自定义'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={handleExitEditMode}
                  disabled={saving}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50 text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 text-sm flex items-center gap-1"
                >
                  {saving && (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  保存
                </button>
              </>
            ) : (
              <>
                {/* 一键复制文案 */}
                <button
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all text-sm flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制文案
                </button>
                {/* 标记为已发布 */}
                {post.status === 0 && (
                  <button
                    onClick={handleMarkAsPublished}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-all text-sm"
                  >
                    标记已发布
                  </button>
                )}
                <button
                  onClick={handleEnterEditMode}
                  className="px-3 py-1.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  删除
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主体内容 - 可滚动 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            {/* 来源信息 */}
            {post.projectName && (
              <div className="mb-4 pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">关联项目：</span>
                <span className="text-sm font-medium text-slate-700">{post.projectName}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* 标题 */}
              <div>
                <label className="text-sm text-slate-500 mb-1 block">标题</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                    placeholder="请输入标题"
                  />
                ) : (
                  <div className="text-lg font-semibold text-slate-800">{post.title || '-'}</div>
                )}
              </div>

              {/* 正文内容 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-slate-500">正文内容</label>
                  {!isEditMode && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(post.content || '');
                          toast.success('已复制正文');
                        } catch (err) {
                          toast.error('复制失败');
                        }
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      复制
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none text-sm leading-relaxed"
                    rows={8}
                    placeholder="请输入正文内容..."
                  />
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[150px]">
                    {post.content || '暂无内容'}
                  </div>
                )}
              </div>

              {/* 标签 */}
              <div>
                <label className="text-sm text-slate-500 mb-1 block">标签</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                    placeholder="请输入标签，用逗号分隔"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {post.tags ? (
                      post.tags.split(',').map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">暂无标签</span>
                    )}
                  </div>
                )}
              </div>

              {/* 配图展示 - 混合显示项目图和AI图 */}
              {!isEditMode && totalImageCount > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-slate-500">
                      配图（共 {totalImageCount} 张）
                    </label>
                    <div className="flex gap-2">
                      {projectImageCount > 0 && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          项目图 {projectImageCount} 张
                        </span>
                      )}
                      {aiImageCount > 0 && (
                        <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          AI图 {aiImageCount} 张
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {/* 项目图片 */}
                    {post.selectedImages?.map((imageId: number) => (
                      <div
                        key={`project-${imageId}`}
                        className="relative rounded-lg overflow-hidden border border-blue-200 bg-slate-50"
                      >
                        <img
                          src={`/api/images/${imageId}`}
                          alt={`项目配图 ${imageId}`}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setPreviewImage(imageId)}
                        />
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          项目图
                        </span>
                      </div>
                    ))}

                    {/* AI配图 */}
                    {post.aiImages?.map((img: AiImageInfo) => (
                      <div
                        key={`ai-${img.attachmentId}`}
                        className="relative rounded-lg overflow-hidden border border-purple-200 bg-slate-50"
                      >
                        <img
                          src={img.url || `/api/images/${img.attachmentId}`}
                          alt={`AI配图 ${img.order}`}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setPreviewImage(img.attachmentId)}
                        />
                        <span className="absolute bottom-1 left-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          AI图
                        </span>
                        <button
                          onClick={() => handleDeleteAiImage(img.attachmentId)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">点击图片可查看大图，AI图可单独删除</p>
                </div>
              )}

              {/* 生成更多AI配图按钮 */}
              {!isEditMode && !aiImageGenerating && aiImageCount < 9 && (
                <div>
                  <button
                    onClick={handleOpenAiImageModal}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {aiImageCount === 0 ? '生成AI配图' : '生成更多AI配图'}
                  </button>
                </div>
              )}

              {/* AI配图生成中提示 */}
              {aiImageGenerating && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                    <span className="text-sm font-medium text-purple-700">AI正在生成配图...</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">每张图片约需10-15秒，请耐心等待</p>
                </div>
              )}

              {/* 无配图提示 */}
              {!isEditMode && totalImageCount === 0 && !aiImageGenerating && (
                <div className="text-center py-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">暂无配图</p>
                  <p className="text-xs text-slate-400 mt-1">点击下方按钮生成AI配图</p>
                </div>
              )}

              {/* 时间信息 */}
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">创建时间：</span>
                    <span className="text-slate-600">{post.createdAt ? new Date(post.createdAt).toLocaleString('zh-CN') : '-'}</span>
                  </div>
                  {post.updatedAt && (
                    <div>
                      <span className="text-slate-400">更新时间：</span>
                      <span className="text-slate-600">{new Date(post.updatedAt).toLocaleString('zh-CN')}</span>
                    </div>
                  )}
                </div>
                {/* 发布信息 */}
                {post.status === 1 && (post.publishPlatform || post.publishUrl) && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-sm">
                      <span className="text-slate-400">发布平台：</span>
                      <span className="text-slate-600">{post.publishPlatform || '-'}</span>
                    </div>
                    {post.publishUrl && (
                      <div className="mt-1 text-sm">
                        <span className="text-slate-400">发布链接：</span>
                        <a
                          href={post.publishUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 underline"
                        >
                          {post.publishUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 确认对话框 */}
      {confirmConfig?.show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmConfig(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{confirmConfig.title}</h3>
            <p className="text-slate-600 mb-6 whitespace-pre-line">{confirmConfig.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmConfig(null)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI配图生成弹窗 */}
      {aiImageModal?.show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAiImageModal(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">生成AI配图</h3>

            {/* 配图数量 */}
            <div className="mb-4">
              <label className="text-sm text-slate-600 mb-2 block">配图数量</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={Math.min(9 - aiImageCount, 4)}
                  value={aiImageModal.count}
                  onChange={(e) => setAiImageModal({ ...aiImageModal, count: Number(e.target.value) })}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="w-8 text-center text-sm font-medium text-purple-600 bg-purple-100 rounded px-2 py-1">
                  {aiImageModal.count}
                </span>
              </div>
            </div>

            {/* 风格选择 */}
            <div className="mb-6">
              <label className="text-sm text-slate-600 mb-2 block">风格偏好（可选）</label>
              <select
                value={aiImageModal.style}
                onChange={(e) => setAiImageModal({ ...aiImageModal, style: e.target.value })}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm bg-white focus:border-purple-400 focus:outline-none"
              >
                <option value="">自动匹配文案风格</option>
                <option value="modern minimalist">现代简约</option>
                <option value="warm atmosphere">温馨氛围</option>
                <option value="professional commercial">专业商业</option>
                <option value="artistic creative">艺术创意</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAiImageModal(null)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleGenerateAiImages}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                开始生成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图片预览模态框 */}
      {previewImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={`/api/images/${previewImage}`}
              alt="预览图片"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPostDetail;