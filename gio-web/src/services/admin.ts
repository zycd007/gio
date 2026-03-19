import request from './api';

/**
 * 管理员登录
 */
export const login = (username: string, password: string) => {
  return request.post('/admin/login', { username, password });
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return request.get('/admin/me');
};

/**
 * 退出登录
 */
export const logout = () => {
  return request.post('/admin/logout');
};

/**
 * 获取所有分类
 */
export const getCategories = () => {
  return request.get('/admin/categories');
};

/**
 * 创建分类
 */
export const createCategory = (data: any) => {
  return request.post('/admin/categories', data);
};

/**
 * 更新分类
 */
export const updateCategory = (id: number, data: any) => {
  return request.put(`/admin/categories/${id}`, data);
};

/**
 * 删除分类
 */
export const deleteCategory = (id: number) => {
  return request.delete(`/admin/categories/${id}`);
};

/**
 * 获取项目列表
 */
export const getProjects = (page: number = 1, size: number = 10, categoryId?: number) => {
  return request.get('/admin/projects', {
    params: { page, size, categoryId }
  });
};

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: number) => {
  return request.get(`/admin/projects/${id}`);
};

/**
 * 创建项目
 */
export const createProject = (data: any) => {
  return request.post('/admin/projects', data);
};

/**
 * 更新项目
 */
export const updateProject = (id: number, data: any) => {
  return request.put(`/admin/projects/${id}`, data);
};

/**
 * 删除项目
 */
export const deleteProject = (id: number) => {
  return request.delete(`/admin/projects/${id}`);
};

/**
 * 上传项目图片
 */
export const uploadImages = (projectId: number, files: File[]) => {
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
export const getProjectImages = (projectId: number) => {
  return request.get(`/admin/projects/${projectId}/images`);
};

/**
 * 删除图片
 */
export const deleteImage = (imageId: number) => {
  return request.delete(`/admin/images/${imageId}`);
};

/**
 * 设置封面图
 */
export const setAsCover = (imageId: number) => {
  return request.put(`/admin/images/${imageId}/cover`);
};
