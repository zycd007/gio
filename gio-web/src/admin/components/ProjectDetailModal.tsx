import { ProjectDetail as ProjectDetailType } from '@/services/admin';

interface ProjectDetailModalProps {
  project: ProjectDetailType;
  visible: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  visible,
  onClose
}) => {
  if (!visible || !project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ maxHeight: '100vh' }}
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl my-8 overflow-hidden flex flex-col shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">项目详情</h2>
            <p className="text-sm text-slate-500 mt-1">{project.name}</p>
          </div>
          <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all p-2.5 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* 项目基本信息 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1">项目名称</div>
                <div className="font-medium text-slate-800">{project.name}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1">项目分类</div>
                <div className="font-medium text-slate-800">{project.categoryName}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1">项目位置</div>
                <div className="font-medium text-slate-800">{project.location || '-'}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1">设计年份</div>
                <div className="font-medium text-slate-800">{project.year || '-'}</div>
              </div>
            </div>
          </div>

          {/* 项目描述 */}
          {project.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                项目描述
              </h3>
              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>
          )}

          {/* 项目图片 */}
          {project.images && project.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                项目图片
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="relative border border-slate-200 rounded-xl overflow-hidden">
                    <img
                      src={`/api/images/${img.id}`}
                      alt={img.imageName}
                      className="w-full h-40 object-cover"
                    />
                    {img.isCover === 1 && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                        封面
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end shrink-0">
          <button
            onClick={() => onClose()}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;