const trackService = {
  // 重试配置
  maxRetries: 3,
  retryDelay: 1000, // 1秒后重试

  // 通用埋点请求方法（带重试）
  sendWithRetry: (url: string, data: object, retries: number = 0) => {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (!sent && retries < trackService.maxRetries) {
        // sendBeacon 返回 false 或失败时，使用 fetch 重试
        setTimeout(() => {
          trackService.sendWithRetry(url, data, retries + 1);
        }, trackService.retryDelay);
      }
    } else {
      // 降级使用 fetch
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {
        if (retries < trackService.maxRetries) {
          setTimeout(() => {
            trackService.sendWithRetry(url, data, retries + 1);
          }, trackService.retryDelay);
        } else {
          console.error('[Track] Failed to track after', trackService.maxRetries, 'retries');
        }
      });
    }
  },

  trackPageView: (pageUrl: string, projectId?: number) => {
    const data = {
      pageUrl,
      projectId,
      referrer: document.referrer || '',
    };
    trackService.sendWithRetry('/api/track/pageview', data);
  },

  trackDuration: (pageUrl: string, projectId: number | undefined, duration: number) => {
    const data = {
      pageUrl,
      projectId,
      duration,
    };
    trackService.sendWithRetry('/api/track/duration', data);
  },
};

export default trackService;
