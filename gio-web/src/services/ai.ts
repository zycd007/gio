import request from './api';

/**
 * AI 文案生成相关 API
 */

export interface AiCopywritingResponse {
  title: string;
  content: string;
  tags: string[];
}

export interface AiCopywritingRequest {
  style: string;
}

/**
 * 生成 AI 文案（非流式，兼容旧接口）
 * @param projectId 项目 ID
 * @param style 文案风格 (professional, seed, story, minimal)
 */
export const generateAiCopywriting = (
  projectId: number,
  style: string
): Promise<AiCopywritingResponse> => {
  return request.post(`/admin/projects/${projectId}/ai-copywriting`, {
    style
  });
};

/**
 * 生成 AI 文案（流式 SSE）
 * @param projectId 项目 ID
 * @param style 文案风格
 * @param onContent 接收实时内容的回调（累积内容）
 * @returns Promise<void> 完成或失败
 */
export const generateAiCopywritingStream = (
  projectId: number,
  style: string,
  onContent: (content: string) => void
): Promise<{ title: string; content: string; tags: string[] }> => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('admin_token');
    const url = `/api/admin/projects/${projectId}/ai-copywriting/stream`;

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
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 处理 SSE 格式
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // 处理 event 行
          if (line.startsWith('event:')) {
            lastEvent = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            // 处理 data 行
            const data = line.slice(5).trimStart();

            if (data === '[DONE]') {
              continue;
            }

            if (lastEvent === 'content') {
              // content 事件：累积 token
              fullContent += data;
              onContent(fullContent);
            } else if (lastEvent === 'complete') {
              // complete 事件
              fullContent = data;
              onContent(fullContent);
            } else if (lastEvent === 'error') {
              try {
                const json = JSON.parse(data);
                reject(new Error(json.error || data));
              } catch (e) {
                reject(new Error(data));
              }
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
          resolve({
            title: '',
            content: fullContent,
            tags: []
          });
        }
      } catch (e) {
        resolve({
          title: '',
          content: fullContent,
          tags: []
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
