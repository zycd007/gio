const trackService = {
  trackPageView: (pageUrl: string, projectId?: number) => {
    // 使用 sendBeacon 确保页面关闭时数据能发送
    const data = JSON.stringify({
      pageUrl,
      projectId,
      referrer: document.referrer || '',
    });

    // 优先使用 sendBeacon（页面卸载时也能发送）
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/pageview', data);
    } else {
      // 降级使用 fetch
      fetch('/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(err => {
        console.error('Page view tracking failed:', err);
      });
    }
  },

  trackDuration: (pageUrl: string, projectId: number | undefined, duration: number) => {
    const data = JSON.stringify({
      pageUrl,
      projectId,
      duration,
    });

    // 使用 sendBeacon 确保页面关闭时数据能发送
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/duration', data);
    } else {
      // 降级使用 fetch
      fetch('/api/track/duration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(err => {
        console.error('Duration tracking failed:', err);
      });
    }
  },
};

export default trackService;
