import { useState, useEffect } from 'react';
import { getProjects, deleteProject, uploadImages, createProject, updateProject } from '@/services/admin';

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  status: number;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProjects();
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
    if (confirm('确定要删除这个项目吗？')) {
      deleteProject(id).then(() => {
        loadProjects();
      });
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        location: project.location,
        year: project.year,
        categoryId: 1,
        description: '',
        sortOrder: 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        location: '',
        year: '',
        categoryId: 1,
        description: '',
        sortOrder: 0,
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
      alert('图片上传成功');
    } catch (err: any) {
      alert('上传失败：' + err.message);
    } finally {
      setUploading(false);
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
    </div>
  );
};

export default AdminProjects;
