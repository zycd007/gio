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

export interface Category {
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

export interface ProjectDetail {
  id: number;
  name: string;
  location: string;
  year: string;
  description: string;
  categoryId: number;
  categoryName: string;
  coverImageId?: number;
  viewCount: number;
  status: number;
  isFeatured: number;
  images: ProjectImage[];
}

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSocialPosts: number;
  totalImages: number;
}

export interface ProjectImage {
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
export const getProjects = (page: number = 1, size: number = 10, categoryId?: number, keyword?: string, isFeatured?: number, status?: number): Promise<ProjectListResult> => {
  return request.get('/admin/projects', {
    params: { page, size, categoryId, keyword, isFeatured, status }
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
 * 临时上传图片（用于新建项目前）
 */
export const uploadTempImages = (files: File[]): Promise<number[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return request.post('/admin/images/temp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 将临时图片关联到项目
 */
export const associateImagesToProject = (projectId: number, imageIds: number[]): Promise<void> => {
  return request.post(`/admin/projects/${projectId}/images/associate`, { imageIds });
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
 * 批量更新图片排序
 */
export const updateImageSortOrder = (projectId: number, sortList: { imageId: number; sortOrder: number }[]): Promise<void> => {
  return request.put(`/admin/projects/${projectId}/images/sort`, sortList);
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

/**
 * 清空所有留言
 */
export const clearAllMessages = (): Promise<void> => {
  return request.delete('/admin/messages');
};

// ========== 批量操作 ==========

/**
 * 批量更新项目状态
 */
export const batchUpdateProjectStatus = (ids: number[], status: number): Promise<void> => {
  return request.put('/admin/projects/batch/status', { ids, value: status });
};

/**
 * 批量设置/取消精品
 */
export const batchSetProjectFeatured = (ids: number[], isFeatured: number): Promise<void> => {
  return request.put('/admin/projects/batch/featured', { ids, value: isFeatured });
};

/**
 * 批量删除项目
 */
export const batchDeleteProjects = (ids: number[]): Promise<void> => {
  return request.delete('/admin/projects/batch', { data: ids });
};

/**
 * 批量更新项目排序
 */
export const updateProjectSortOrder = (sortList: { projectId: number; sortOrder: number }[]): Promise<void> => {
  return request.put('/admin/projects/sort', sortList);
};

// ========== 数据分析 ==========

interface TimeRangeInfo {
  days: number;
  startDate: string;
  endDate: string;
  label: string;
}

interface TodayStats {
  uv: number;
  pv: number;
}

interface TrendItem {
  date: string;
  uv: number;
  pv: number;
}

interface TopProject {
  projectId: number;
  name: string;
  viewCount: number;
}

interface PageHeatmapItem {
  pageUrl: string;
  viewCount: number;
  uv: number;
  pageTitle: string;
}

interface HourlyItem {
  hour: number;
  pv: number;
  uv: number;
}

interface AvgDurationStats {
  avgDurationSeconds: number;
  avgDurationFormatted: string;
}

interface ReferrerItem {
  referrer: string;
  count: number;
  referrerName: string;
  category: string;
}

interface DeviceStats {
  mobileCount: number;
  desktopCount: number;
  tabletCount: number;
  unknownCount: number;
  mobilePercent: number;
  desktopPercent: number;
  tabletPercent: number;
}

interface BounceRateStats {
  bounceRate: number;
  bounceCount: number;
  totalVisits: number;
  description: string;
}

interface VisitorTypeStats {
  newVisitorCount: number;
  returningVisitorCount: number;
  newVisitorPercent: number;
  returningVisitorPercent: number;
}

interface DashboardAnalytics {
  timeRange: TimeRangeInfo;
  today: TodayStats;
  trend: TrendItem[];
  topProjects: TopProject[];
  pageHeatmap: PageHeatmapItem[];
  hourlyStats: HourlyItem[];
  avgDuration: AvgDurationStats;
  referrerStats: ReferrerItem[];
  deviceStats: DeviceStats;
  bounceRate: BounceRateStats;
  visitorTypeStats: VisitorTypeStats;
}

/**
 * 获取仪表盘分析数据（UV/PV/趋势/项目排行/设备分布/渠道来源等）
 * @param days 时间范围天数（7、30 等）
 * @param startDate 开始日期（可选，与 endDate 一起使用）
 * @param endDate 结束日期（可选，与 startDate 一起使用）
 */
export const getDashboardAnalytics = (
  days?: number,
  startDate?: string,
  endDate?: string
): Promise<DashboardAnalytics> => {
  const params: any = {};
  if (days !== undefined) {
    params.days = days;
  }
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  return request.get('/admin/dashboard/analytics', { params });
};

// ========== 单文件上传（用于串行上传） ==========

/**
 * 上传单个临时图片（用于新建项目场景）
 * 返回 imageId
 */
export const uploadSingleTempImage = async (
  file: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<number> => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await request.post('/admin/images/temp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
    signal,
  });

  // 返回第一个 imageId（response 已被拦截器提取为 data）
  return (response as unknown as number[])[0];
};

/**
 * 上传单个项目图片（用于项目详情场景）
 * 返回 imageId
 */
export const uploadSingleProjectImage = async (
  projectId: number,
  file: File,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<number> => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await request.post(`/admin/projects/${projectId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
    signal,
  });

  // 返回第一个 imageId（response 已被拦截器提取为 data）
  const data = response as unknown as any[];
  return data[0]?.id || data[0];
};
