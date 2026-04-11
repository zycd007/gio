// 推文类型
export interface SocialPost {
  id: number;
  type: 'project' | 'custom';
  projectId?: number;
  projectName?: string;
  title: string;
  content: string;
  tags: string;
  selectedImages?: number[];
  status: number; // 0-草稿 1-已发布
  publishPlatform?: string;
  publishUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// 列表项类型
export interface SocialPostListItem {
  id: number;
  type: 'project' | 'custom';
  projectId?: number;
  projectName?: string;
  title: string;
  status: number;
  createdAt: string;
}

// 生成请求类型
export interface SocialPostGenerateRequest {
  type: 'project' | 'custom';
  projectId?: number;
  selectedImageIds?: number[];
  customContent?: string;
  customImageIds?: number[];
}

// 分页结果类型
export interface SocialPostListResult {
  list: SocialPostListItem[];
  total: number;
  page: number;
  size: number;
}
