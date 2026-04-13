// AI配图信息
export interface AiImageInfo {
  attachmentId: number;
  url: string;
  prompt: string;
  generatedAt: string;
  source: 'ai';
  order: number;
}

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
  aiImages?: AiImageInfo[];
  aiImagePrompt?: string;
  aiImageCount?: number;
  aiImageStatus?: number; // 0-未生成 1-生成中 2-已生成 3-生成失败
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

// AI配图生成请求
export interface AiImageGenerateRequest {
  imageCount: number; // 1-9
  stylePrompt?: string;
}

// AI配图生成响应
export interface AiImageGenerateResponse {
  status: number; // 0-未开始 1-生成中 2-完成 3-失败
  totalCount: number;
  completedCount: number;
  message: string;
  images: AiImageInfo[];
}
