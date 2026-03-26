// 项目相关类型
export interface Category {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  designHighlights?: string;
  suitableScenes?: string;
  sortOrder: number;
}

export interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  coverImageId?: number;
  viewCount?: number;
  isFeatured?: number;
}

export interface ProjectDetail extends Project {
  categoryId?: number;
  categoryNameEn?: string;
  description?: number;
  sortOrder?: number;
  images?: ImageInfo[];
}

export interface ImageInfo {
  id: number;
  attachmentId?: number;
  imageName?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  isCover?: number;
}

// 联系表单类型
export interface ContactFormData {
  name: string;
  phone: string;
  content: string;
}

// 联系信息类型
export interface ContactInfo {
  icon: string;
  title: string;
  content: string;
}

// 社交媒体类型
export interface SocialMedia {
  icon: string;
  label: string;
}

// 理念卡片类型
export interface PhilosophyItem {
  icon: string;
  title: string;
  desc: string;
}

// 客户评价类型
export interface Testimonial {
  id: number;
  customerName: string;
  avatar?: string;
  content: string;
  projectName?: string;
  rating: number;
}