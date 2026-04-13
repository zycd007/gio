package com.gio.service;

import com.gio.dto.DashboardStatsVO;

import java.time.LocalDate;

public interface TrackService {
    void trackPageView(String ipHash, String pageUrl, String referrer, Integer projectId, String userAgent);
    void trackDuration(String ipHash, String pageUrl, Integer projectId, Integer duration);

    /**
     * 获取仪表盘分析数据（默认近 7 天）
     */
    DashboardStatsVO getDashboardAnalytics();

    /**
     * 获取仪表盘分析数据（指定天数）
     * @param days 时间范围天数
     */
    DashboardStatsVO getDashboardAnalytics(Integer days);

    /**
     * 获取仪表盘分析数据（自定义日期范围）
     * @param startDate 开始日期
     * @param endDate 结束日期
     */
    DashboardStatsVO getDashboardAnalyticsByRange(LocalDate startDate, LocalDate endDate);
}
