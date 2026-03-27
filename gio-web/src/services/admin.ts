import request from './api';

interface LoginResponse {
  token: string;
  refreshToken: string;
  id: number;
  username: string;
  nickname: string;
  role: string;
}

interface User {
  id: number;
  username: string;
  nickname: string;
  role: string;
  avatar?: string;
}

interface Category {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  sortOrder: number;
  status: number;
}

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryId: number;
  categoryName: string;
  coverImageId?: number;
  viewCount: number;
  status: number;
}

interface ProjectListResult {
  list: Project[];
  total: number;
  page: number;
  size: number;
}

interface ProjectDetail {
  id: number;
  name: string;
  location: string;
  year: string;
  description: string;
  categoryId: number;
  categoryName: string;
  coverImageId?: number;
  viewCount: number;
  images: ProjectImage[];
}

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalCategories: number;
  totalImages: number;
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

/**
 * 管理员登录
 */
export const login = (username: string, password: string): Promise<LoginResponse> => {
  return request.post('/admin/login', { username, password });
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): Promise<User> => {
  return request.get('/admin/me');
};

/**
 * 退出登录
 */
export const logout = (): Promise<void> => {
  return request.post('/admin/logout');
};

/**
 * 获取所有分类
 */
export const getCategories = (): Promise<Category[]> => {
  return request.get('/admin/categories');
};

/**
 * 创建分类
 */
export const createCategory = (data: Partial<Category>): Promise<Category> => {
  return request.post('/admin/categories', data);
};

/**
 * 更新分类
 */
export const updateCategory = (id: number, data: Partial<Category>): Promise<Category> => {
  return request.put(`/admin/categories/${id}`, data);
};

/**
 * 删除分类
 */
export const deleteCategory = (id: number): Promise<void> => {
  return request.delete(`/admin/categories/${id}`);
};

/**
 * 获取项目列表
 */
export const getProjects = (page: number = 1, size: number = 10, categoryId?: number, keyword?: string): Promise<ProjectListResult> => {
  return request.get('/admin/projects', {
    params: { page, size, categoryId, keyword }
  });
};

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: number): Promise<ProjectDetail> => {
  return request.get(`/admin/projects/${id}`);
};

/**
 * 创建项目
 */
export const createProject = (data: Partial<Project>): Promise<Project> => {
  return request.post('/admin/projects', data);
};

/**
 * 更新项目
 */
export const updateProject = (id: number, data: Partial<Project>): Promise<Project> => {
  return request.put(`/admin/projects/${id}`, data);
};

/**
 * 删除项目
 */
export const deleteProject = (id: number): Promise<void> => {
  return request.delete(`/admin/projects/${id}`);
};

/**
 * 更新项目状态（发布/下架）
 */
export const updateProjectStatus = (id: number, status: number): Promise<void> => {
  return request.put(`/admin/projects/${id}/status`, null, {
    params: { status }
  });
};

/**
 * 设置/取消精品项目
 */
export const setProjectFeatured = (id: number, isFeatured: number): Promise<void> => {
  return request.put(`/admin/projects/${id}/featured`, null, {
    params: { isFeatured }
  });
};

/**
 * 上传项目图片
 */
export const uploadImages = (projectId: number, files: File[]): Promise<ProjectImage[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return request.post(`/admin/projects/${projectId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 获取项目图片列表
 */
export const getProjectImages = (projectId: number): Promise<ProjectImage[]> => {
  return request.get(`/admin/projects/${projectId}/images`);
};

/**
 * 删除图片
 */
export const deleteImage = (imageId: number): Promise<void> => {
  return request.delete(`/admin/images/${imageId}`);
};

/**
 * 设置封面图
 */
export const setAsCover = (imageId: number): Promise<void> => {
  return request.put(`/admin/images/${imageId}/cover`);
};

/**
 * 获取仪表盘统计数据
 */
export const getDashboardStats = (): Promise<DashboardStats> => {
  return request.get('/admin/dashboard/stats');
};

// ========== 留言管理 ==========

interface Message {
  id: number;
  name: string;
  phone: string;
  content: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取留言列表
 */
export const getMessages = (page: number = 1, size: number = 10, status?: number): Promise<{ list: Message[]; total: number; page: number; size: number }> => {
  return request.get('/admin/messages', {
    params: { page, size, status }
  }).then((res) => {
    const data = res.data || res;
    return {
      list: data.records || [],
      total: data.total || 0,
      page: data.current || 1,
      size: data.size || 10
    };
  });
};

/**
 * 获取留言详情
 */
export const getMessageDetail = (id: number): Promise<Message> => {
  return request.get(`/admin/messages/${id}`);
};

/**
 * 更新留言状态
 */
export const updateMessageStatus = (id: number, status: number): Promise<void> => {
  return request.put(`/admin/messages/${id}/status`, null, {
    params: { status }
  });
};

/**
 * 删除留言
 */
export const deleteMessage = (id: number): Promise<void> => {
  return request.delete(`/admin/messages/${id}`);
};
