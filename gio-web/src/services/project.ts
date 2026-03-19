import request from './api';

/**
 * 获取所有分类
 */
export const getCategories = () => {
  return request.get('/categories');
};

/**
 * 获取项目列表
 */
export const getProjects = (page: number = 1, size: number = 10, categoryId?: number) => {
  return request.get('/projects', {
    params: { page, size, categoryId }
  });
};

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: number) => {
  return request.get(`/projects/${id}`);
};

/**
 * 获取项目图片
 */
export const getProjectImages = (projectId: number) => {
  return request.get(`/images/project/${projectId}`);
};

/**
 * 获取图片文件（返回 Blob）
 */
export const getImageFile = (imageId: number) => {
  return request.get(`/images/${imageId}`, {
    responseType: 'blob'
  });
};
