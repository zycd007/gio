import request from './api';

interface Category {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  icon: string;
  sortOrder: number;
}

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  coverImageId?: number;
  viewCount: number;
}

interface ProjectListResult {
  list: Project[];
  total: number;
  page: number;
  size: number;
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

interface ProjectDetail {
  id: number;
  name: string;
  location: string;
  year: string;
  description: string;
  categoryName: string;
  categoryNameEn: string;
  coverImageId?: number;
  viewCount: number;
  images: ProjectImage[];
}

/**
 * 获取所有分类
 */
export const getCategories = (): Promise<Category[]> => {
  return request.get('/categories');
};

/**
 * 获取项目列表
 */
export const getProjects = (page: number = 1, size: number = 10, categoryId?: number): Promise<ProjectListResult> => {
  return request.get('/projects', {
    params: { page, size, categoryId }
  });
};

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: number): Promise<ProjectDetail> => {
  return request.get(`/projects/${id}`);
};

/**
 * 获取项目图片
 */
export const getProjectImages = (projectId: number): Promise<ProjectImage[]> => {
  return request.get(`/images/project/${projectId}`);
};

/**
 * 获取图片文件（返回 Blob）
 */
export const getImageFile = (imageId: number): Promise<Blob> => {
  return request.get(`/images/${imageId}`, {
    responseType: 'blob'
  });
};
