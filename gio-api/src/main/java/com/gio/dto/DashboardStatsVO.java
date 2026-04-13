package com.gio.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class DashboardStatsVO {
    // 时间范围信息
    private TimeRangeInfo timeRange;

    // 基础统计
    private TodayStats today;
    private List<TrendItem> trend;
    private List<TopProject> topProjects;

    // 页面访问热度（按 URL）
    private List<PageHeatmapItem> pageHeatmap;

    // 时段分析（按小时）
    private List<HourlyItem> hourlyStats;

    // 平均停留时长
    private AvgDurationStats avgDuration;

    // 访问来源分析
    private List<ReferrerItem> referrerStats;

    // 新增：设备类型分析
    private DeviceStats deviceStats;

    // 新增：跳出率
    private BounceRateStats bounceRate;

    // 新增：新老访客分析
    private VisitorTypeStats visitorTypeStats;

    @Data
    public static class TimeRangeInfo {
        private Integer days;
        private LocalDate startDate;
        private LocalDate endDate;
        private String label; // "近 7 天"、"近 30 天" 等
    }

    @Data
    public static class TodayStats {
        private Integer uv;
        private Integer pv;
    }

    @Data
    public static class TrendItem {
        private LocalDate date;
        private Integer uv;
        private Integer pv;
    }

    @Data
    public static class TopProject {
        private Integer projectId;
        private String name;
        private Integer viewCount;
    }

    @Data
    public static class PageHeatmapItem {
        private String pageUrl;
        private Integer viewCount;
        private Integer uv;
        private String pageTitle;  // 页面标题
    }

    @Data
    public static class HourlyItem {
        private Integer hour;  // 0-23
        private Integer pv;
        private Integer uv;
    }

    @Data
    public static class AvgDurationStats {
        private Integer avgDurationSeconds;  // 平均停留时长（秒）
        private String avgDurationFormatted; // 格式化显示，如 "2 分 30 秒"
    }

    @Data
    public static class ReferrerItem {
        private String referrer;
        private Integer count;
        private String referrerName;  // 友好的显示名称
        private String category;  // 渠道分类：search/social/direct/external
    }

    @Data
    public static class DeviceStats {
        private Integer mobileCount;
        private Integer desktopCount;
        private Integer tabletCount;
        private Integer unknownCount;
        private Integer mobilePercent;  // 百分比，0-100
        private Integer desktopPercent;
        private Integer tabletPercent;
    }

    @Data
    public static class BounceRateStats {
        private Double bounceRate;  // 跳出率，0-100
        private Integer bounceCount;  // 跳出访问数
        private Integer totalVisits;  // 总访问数
        private String description;  // 描述：停留<5 秒的访问占比
    }

    @Data
    public static class VisitorTypeStats {
        private Integer newVisitorCount;  // 新访客数
        private Integer returningVisitorCount;  // 老访客数
        private Integer newVisitorPercent;  // 新访客占比
        private Integer returningVisitorPercent;  // 老访客占比
    }
}
