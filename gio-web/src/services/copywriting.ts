import request from './api';

/**
 * 推文管理相关 API
 */

export interface Copywriting {
  id: number;
  projectId?: number;
  projectName?: string;
  projectCoverImage?: string;
  title: string;
  content: string;
  tags: string[];
  style: string;
  styleName?: string;
  sourceType: number; // 1-项目生成 2-自由创作
  customImages?: string[];
  customDescription?: string;
  status: number; // 0-草稿 1-已发布
  createdAt: string;
  updatedAt: string;
}

export interface CopywritingCreateRequest {
  projectId?: number;
  title: string;
  content: string;
  tags: string; // JSON 字符串
  style: string;
  sourceType?: number;
  customImages?: string; // JSON 字符串
  customDescription?: string;
  status?: number;
}

export interface FreeCopywritingRequest {
  customImages?: string; // JSON 字符串
  description: string;
  style?: string;
}

export interface CopywritingListResult {
  list: Copywriting[];
  total: number;
  page: number;
  size: number;
}

/**
 * 获取推文列表
 */
export const getCopywritings = (
  page: number = 1,
  size: number = 10,
  projectId?: number,
  status?: number,
  sourceType?: number,
  keyword?: string
): Promise<CopywritingListResult> => {
  return request.get('/admin/copywritings', {
    params: { page, size, projectId, status, sourceType, keyword }
  });
};

/**
 * 获取推文详情
 */
export const getCopywritingDetail = (id: number): Promise<Copywriting> => {
  return request.get(`/admin/copywritings/${id}`);
};

/**
 * 创建推文
 */
export const createCopywriting = (data: CopywritingCreateRequest): Promise<Copywriting> => {
  return request.post('/admin/copywritings', data);
};

/**
 * 更新推文
 */
export const updateCopywriting = (id: number, data: CopywritingCreateRequest): Promise<Copywriting> => {
  return request.put(`/admin/copywritings/${id}`, data);
};

/**
 * 删除推文
 */
export const deleteCopywriting = (id: number): Promise<void> => {
  return request.delete(`/admin/copywritings/${id}`);
};

/**
 * 重新生成推文（流式 SSE）
 */
export const regenerateCopywritingStream = (
  id: number,
  style: string,
  onContent: (content: string) => void
): Promise<{ title: string; content: string; tags: string[] }> => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('admin_token');
    const url = `/api/admin/copywritings/${id}/regenerate/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ style })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || '请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder('utf-8');
      let fullContent = '';
      let buffer = '';
      let lastEvent: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            lastEvent = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            const data = line.slice(5).trimStart();
            if (data === '[DONE]') continue;

            if (lastEvent === 'content') {
              fullContent += data;
              onContent(fullContent);
            } else if (lastEvent === 'complete') {
              fullContent = data;
              onContent(fullContent);
            } else if (lastEvent === 'error') {
              const json = JSON.parse(data);
              reject(new Error(json.error || data));
              return;
            }
          }
        }
      }

      // 解析最终的 JSON
      try {
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[0]);
          resolve({
            title: json.title || '',
            content: json.content || '',
            tags: json.tags || []
          });
        } else {
          resolve({ title: '', content: fullContent, tags: [] });
        }
      } catch (e) {
        resolve({ title: '', content: fullContent, tags: [] });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 获取项目关联的推文列表
 */
export const getProjectCopywritings = (projectId: number): Promise<Copywriting[]> => {
  return request.get(`/admin/projects/${projectId}/copywritings`);
};

/**
 * 自由创作 - 生成推文（流式 SSE）
 */
export const generateFreeCopywritingStream = (
  request: FreeCopywritingRequest,
  onContent: (content: string) => void
): Promise<{ title: string; content: string; tags: string[] }> => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('admin_token');
    const url = `/api/admin/copywriting/free/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || '请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder('utf-8');
      let fullContent = '';
      let buffer = '';
      let lastEvent: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            lastEvent = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            const data = line.slice(5).trimStart();
            if (data === '[DONE]') continue;

            if (lastEvent === 'content') {
              fullContent += data;
              onContent(fullContent);
            } else if (lastEvent === 'complete') {
              fullContent = data;
              onContent(fullContent);
            } else if (lastEvent === 'error') {
              const json = JSON.parse(data);
              reject(new Error(json.error || data));
              return;
            }
          }
        }
      }

      try {
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[0]);
          resolve({
            title: json.title || '',
            content: json.content || '',
            tags: json.tags || []
          });
        } else {
          resolve({ title: '', content: fullContent, tags: [] });
        }
      } catch (e) {
        resolve({ title: '', content: fullContent, tags: [] });
      }
    } catch (error) {
      reject(error);
    }
  });
};
