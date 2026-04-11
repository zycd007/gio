import request from './api';
import { SocialPost, SocialPostGenerateRequest, SocialPostListResult } from '../types/socialPost';

/**
 * 生成推文（AI）
 */
export const generatePost = (data: SocialPostGenerateRequest): Promise<SocialPost> => {
  return request.post('/admin/social-posts/generate', data);
};

/**
 * 获取推文列表
 */
export const getPostList = (
  page: number = 1,
  size: number = 10,
  type?: string,
  status?: number,
  keyword?: string
): Promise<SocialPostListResult> => {
  return request.get('/admin/social-posts', {
    params: { page, size, type, status, keyword }
  });
};

/**
 * 获取推文详情
 */
export const getPostDetail = (id: number): Promise<SocialPost> => {
  return request.get(`/admin/social-posts/${id}`);
};

/**
 * 更新推文
 */
export const updatePost = (id: number, data: Partial<SocialPost>): Promise<SocialPost> => {
  return request.put(`/admin/social-posts/${id}`, data);
};

/**
 * 删除推文
 */
export const deletePost = (id: number): Promise<void> => {
  return request.delete(`/admin/social-posts/${id}`);
};

/**
 * 更新发布状态
 */
export const updatePublishStatus = (
  id: number,
  status: number,
  platform?: string,
  url?: string
): Promise<void> => {
  return request.put(`/admin/social-posts/${id}/publish`, null, {
    params: { status, platform, url }
  });
};
