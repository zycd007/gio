import { useState, useEffect } from 'react';
import { getProjects, deleteProject, uploadImages, createProject, updateProject, updateProjectStatus, getCategories, getProjectImages, deleteImage, setAsCover } from '@/services/admin';
import { toast } from 'sonner';

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryId: number;
  categoryName: string;
  status: number;
}

interface Category {
  id: number;
  name: string;
}

interface ProjectImage {
  id: number;
  attachmentId: number;
  imageName: string;
  width: number;
  height: number;
  fileSize: number;
  isCover: number;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    year: '',
    categoryId: 1,
    description: '',
    sortOrder: 0,
    status: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    loadProjects();
    getCategories().then((data) => {
      setCategories(data || []);
    });
  }, []);

  const loadProjects = () => {
    setLoading(true);
    getProjects(1, 100)
      .then((data) => {
        setProjects(data.list || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这个项目吗？删除项目将同时删除所有相关图片。',
      onConfirm: () => {
        deleteProject(id).then(() => {
          loadProjects();
          toast.success('项目已删除');
        });
        setConfirmConfig(null);
      }
    });
  };

  const handleStatusChange = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateProjectStatus(id, newStatus).then(() => {
      loadProjects();
    });
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        location: project.location || '',
        year: project.year || '',
        categoryId: project.categoryId || 1,
        description: '',
        sortOrder: 0,
        status: project.status,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        location: '',
        year: '',
        categoryId: categories.length > 0 ? categories[0].id : 1,
        description: '',
        sortOrder: 0,
        status: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData).then(() => {
        setShowModal(false);
        loadProjects();
      });
    } else {
      createProject(formData).then(() => {
        setShowModal(false);
        loadProjects();
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await uploadImages(projectId, Array.from(files));
      toast.success('图片上传成功');
      if (currentProjectId === projectId) {
        loadProjectImages(projectId);
      }
    } catch (err: any) {
      toast.error('上传失败：' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManageImages = (projectId: number) => {
    setCurrentProjectId(projectId);
    setShowImageModal(true);
    loadProjectImages(projectId);
  };

  const loadProjectImages = (projectId: number) => {
    setLoadingImages(true);
    getProjectImages(projectId)
      .then((images) => {
        setProjectImages(images || []);
      })
      .finally(() => {
        setLoadingImages(false);
      });
  };

  const handleDeleteImage = async (imageId: number) => {
    setConfirmConfig({
      show: true,
      title: '确认删除',
      message: '确定要删除这张图片吗？',
      onConfirm: async () => {
        try {
          await deleteImage(imageId);
          toast.success('图片已删除');
          if (currentProjectId) {
            loadProjectImages(currentProjectId);
          }
        } catch (err: any) {
          toast.error('删除失败：' + err.message);
        }
        setConfirmConfig(null);
      }
    });
  };

  const handleSetCover = async (imageId: number) => {
    try {
      await setAsCover(imageId);
      toast.success('封面设置成功');
      if (currentProjectId) {
        loadProjectImages(currentProjectId);
      }
    } catch (err: any) {
      toast.error('设置封面失败：' + err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-gray-800">项目管理</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary px-4 py-2">
          + 新建项目
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">加载中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">项目名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">年份</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{project.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{project.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{project.categoryName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{project.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{project.year}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 1 ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => handleOpenModal(project)} className="text-primary hover:underline">
                      编辑
                    </button>
                    <button
                      onClick={() => handleStatusChange(project.id, project.status)}
                      className={`hover:underline ${project.status === 1 ? 'text-orange-600' : 'text-green-600'}`}
                    >
                      {project.status === 1 ? '下架' : '发布'}
                    </button>
                    <label className="text-blue-600 hover:underline cursor-pointer">
                      上传图片
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, project.id)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <button onClick={() => handleManageImages(project.id)} className="text-purple-600 hover:underline">
                      管理图片
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:underline">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 新建/编辑项目弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium mb-4">{editingProject ? '编辑项目' : '新建项目'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  取消
                </button>
                <button type="submit" className="px-4 py-2 btn-primary rounded">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 图片管理弹窗 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">图片管理</h2>
              <button onClick={() => setShowImageModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <label className="btn-primary px-4 py-2 rounded cursor-pointer">
                上传图片
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && currentProjectId) {
                      handleImageUpload(e, currentProjectId);
                    }
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <span className="text-sm text-gray-500">{uploading ? '上传中...' : ''}</span>
            </div>

            {loadingImages ? (
              <div className="text-center py-10 text-gray-400">加载中...</div>
            ) : projectImages.length === 0 ? (
              <div className="text-center py-10 text-gray-400">暂无图片</div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 gap-4">
                  {projectImages.map((img) => (
                    <div key={img.id} className="relative border rounded p-2">
                      <img
                        src={`/api/images/${img.id}?t=${Date.now()}`}
                        alt={img.imageName}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">加载失败</text></svg>';
                        }}
                      />
                      {img.isCover === 1 && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-1 rounded">封面</span>
                      )}
                      <div className="mt-2 flex gap-2 text-xs">
                        {img.isCover !== 1 && (
                          <button
                            onClick={() => handleSetCover(img.id)}
                            className="text-green-600 hover:underline"
                          >
                            设为封面
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="text-red-600 hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 确认对话框 */}
      {confirmConfig?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{confirmConfig.title}</h3>
            <p className="text-gray-500 mb-6">{confirmConfig.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmConfig(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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

export default AdminProjects;
