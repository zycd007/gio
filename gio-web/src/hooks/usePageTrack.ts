import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import trackService from '@/services/track';

export function usePageTrack(projectId?: number) {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // 重置状态
    hasTrackedRef.current = false;
    startTimeRef.current = Date.now();

    // 页面浏览埋点
    trackService.trackPageView(location.pathname, projectId);
    hasTrackedRef.current = true;

    // 页面离开时发送时长 - 使用 beforeunload
    const handleBeforeUnload = () => {
      if (hasTrackedRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackService.trackDuration(location.pathname, projectId, duration);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, projectId]);
}
