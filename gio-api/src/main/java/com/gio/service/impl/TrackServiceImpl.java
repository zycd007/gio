package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.gio.dto.DashboardStatsVO;
import com.gio.entity.PageViewLog;
import com.gio.entity.Project;
import com.gio.mapper.PageViewLogMapper;
import com.gio.service.ProjectService;
import com.gio.service.TrackService;
import com.gio.util.DeviceTypeAnalyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrackServiceImpl implements TrackService {

    @Autowired
    private PageViewLogMapper pageViewLogMapper;

    @Autowired
    private ProjectService projectService;

    @Override
    public void trackPageView(String ip, String pageUrl, String referrer, Integer projectId, String userAgent) {
        String ipHash = sha256(ip + (userAgent != null ? userAgent : ""));
        PageViewLog log = new PageViewLog();
        log.setIpHash(ipHash);
        log.setPageUrl(pageUrl);
        log.setReferrer(referrer);
        log.setProjectId(projectId != null ? projectId : 0);
        log.setUserAgent(userAgent);
        log.setDuration(0);
        log.setVisitDate(LocalDate.now());
        log.setCreatedAt(LocalDateTime.now());
        pageViewLogMapper.insert(log);
    }

    @Override
    public void trackDuration(String ip, String pageUrl, Integer projectId, Integer duration) {
        String ipHash = sha256(ip);
        LocalDate today = LocalDate.now();
        var queryWrapper = new QueryWrapper<PageViewLog>()
                .eq("ip_hash", ipHash)
                .eq("page_url", pageUrl)
                .eq("visit_date", today)
                .orderByDesc("created_at")
                .last("LIMIT 1");
        PageViewLog log = pageViewLogMapper.selectOne(queryWrapper);
        if (log != null) {
            log.setDuration(duration);
            pageViewLogMapper.updateById(log);
        }
    }

    @Override
    public DashboardStatsVO getDashboardAnalytics() {
        return getDashboardAnalytics(7);
    }

    @Override
    public DashboardStatsVO getDashboardAnalytics(Integer days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);
        return getDashboardAnalyticsByRange(startDate, today, days);
    }

    @Override
    public DashboardStatsVO getDashboardAnalyticsByRange(LocalDate startDate, LocalDate endDate) {
        int days = (int) (java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1);
        return getDashboardAnalyticsByRange(startDate, endDate, days);
    }

    /**
     * 核心统计方法
     */
    private DashboardStatsVO getDashboardAnalyticsByRange(LocalDate startDate, LocalDate endDate, Integer days) {
        DashboardStatsVO vo = new DashboardStatsVO();

        // 设置时间范围信息
        DashboardStatsVO.TimeRangeInfo timeRange = new DashboardStatsVO.TimeRangeInfo();
        timeRange.setDays(days);
        timeRange.setStartDate(startDate);
        timeRange.setEndDate(endDate);
        timeRange.setLabel(buildTimeRangeLabel(startDate, endDate, days));
        vo.setTimeRange(timeRange);

        // 查询时间范围内的所有日志
        var logQuery = new QueryWrapper<PageViewLog>()
                .ge("visit_date", startDate)
                .le("visit_date", endDate);
        List<PageViewLog> allLogs = pageViewLogMapper.selectList(logQuery);

        // 1. 今日 UV/PV
        LocalDate today = LocalDate.now();
        List<PageViewLog> todayLogs = allLogs.stream()
                .filter(log -> log.getVisitDate().equals(today))
                .collect(Collectors.toList());

        DashboardStatsVO.TodayStats todayStat = new DashboardStatsVO.TodayStats();
        todayStat.setUv((int) todayLogs.stream().map(PageViewLog::getIpHash).distinct().count());
        todayStat.setPv(todayLogs.size());
        vo.setToday(todayStat);

        // 2. 近 N 天趋势
        Map<LocalDate, List<PageViewLog>> logsByDate = allLogs.stream()
                .collect(Collectors.groupingBy(PageViewLog::getVisitDate));

        List<DashboardStatsVO.TrendItem> trend = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<PageViewLog> dayLogs = logsByDate.getOrDefault(date, new ArrayList<>());
            DashboardStatsVO.TrendItem item = new DashboardStatsVO.TrendItem();
            item.setDate(date);
            item.setPv(dayLogs.size());
            item.setUv((int) dayLogs.stream().map(PageViewLog::getIpHash).distinct().count());
            trend.add(item);
        }
        vo.setTrend(trend);

        // 3. 项目浏览排行
        List<PageViewLog> projectLogs = allLogs.stream()
                .filter(log -> log.getProjectId() != null && log.getProjectId() != 0)
                .collect(Collectors.toList());

        Map<Integer, Long> viewCountByProject = projectLogs.stream()
                .collect(Collectors.groupingBy(PageViewLog::getProjectId, Collectors.counting()));

        List<Integer> projectIds = new ArrayList<>(viewCountByProject.keySet());
        Map<Integer, String> projectNames = new HashMap<>();
        if (!projectIds.isEmpty()) {
            List<Project> projects = projectService.listByIds(projectIds);
            projects.forEach(p -> projectNames.put(p.getId(), p.getName()));
        }

        List<DashboardStatsVO.TopProject> topProjects = viewCountByProject.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(10)
                .map(entry -> {
                    DashboardStatsVO.TopProject tp = new DashboardStatsVO.TopProject();
                    tp.setProjectId(entry.getKey());
                    tp.setName(projectNames.getOrDefault(entry.getKey(), "未知项目"));
                    tp.setViewCount(entry.getValue().intValue());
                    return tp;
                })
                .collect(Collectors.toList());
        vo.setTopProjects(topProjects);

        // 4. 页面访问热度
        Map<String, List<PageViewLog>> logsByUrl = allLogs.stream()
                .collect(Collectors.groupingBy(PageViewLog::getPageUrl));

        List<DashboardStatsVO.PageHeatmapItem> pageHeatmap = logsByUrl.entrySet().stream()
                .map(entry -> {
                    DashboardStatsVO.PageHeatmapItem item = new DashboardStatsVO.PageHeatmapItem();
                    item.setPageUrl(entry.getKey());
                    item.setViewCount(entry.getValue().size());
                    item.setUv((int) entry.getValue().stream().map(PageViewLog::getIpHash).distinct().count());
                    item.setPageTitle(extractPageTitle(entry.getKey()));
                    return item;
                })
                .sorted((a, b) -> b.getViewCount() - a.getViewCount())
                .limit(10)
                .collect(Collectors.toList());
        vo.setPageHeatmap(pageHeatmap);

        // 5. 时段分析
        Map<Integer, List<PageViewLog>> logsByHour = allLogs.stream()
                .collect(Collectors.groupingBy(log -> log.getCreatedAt().getHour()));

        List<DashboardStatsVO.HourlyItem> hourlyStats = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            DashboardStatsVO.HourlyItem item = new DashboardStatsVO.HourlyItem();
            item.setHour(hour);
            List<PageViewLog> hourLogs = logsByHour.getOrDefault(hour, new ArrayList<>());
            item.setPv(hourLogs.size());
            item.setUv((int) hourLogs.stream().map(PageViewLog::getIpHash).distinct().count());
            hourlyStats.add(item);
        }
        vo.setHourlyStats(hourlyStats);

        // 6. 平均停留时长
        List<Integer> durations = allLogs.stream()
                .map(PageViewLog::getDuration)
                .filter(d -> d != null && d > 0)
                .collect(Collectors.toList());

        DashboardStatsVO.AvgDurationStats avgDuration = new DashboardStatsVO.AvgDurationStats();
        if (!durations.isEmpty()) {
            int avgSeconds = durations.stream().mapToInt(Integer::intValue).sum() / durations.size();
            avgDuration.setAvgDurationSeconds(avgSeconds);
            avgDuration.setAvgDurationFormatted(formatDuration(avgSeconds));
        } else {
            avgDuration.setAvgDurationSeconds(0);
            avgDuration.setAvgDurationFormatted("0 分 0 秒");
        }
        vo.setAvgDuration(avgDuration);

        // 7. 访问来源分析
        Map<String, List<PageViewLog>> logsByReferrer = allLogs.stream()
                .collect(Collectors.groupingBy(log -> {
                    String ref = log.getReferrer();
                    if (ref == null || ref.isEmpty() || "null".equals(ref)) {
                        return "(直接访问)";
                    }
                    return ref;
                }));

        List<DashboardStatsVO.ReferrerItem> referrerStats = logsByReferrer.entrySet().stream()
                .map(entry -> {
                    DashboardStatsVO.ReferrerItem item = new DashboardStatsVO.ReferrerItem();
                    item.setReferrer(entry.getKey());
                    item.setCount(entry.getValue().size());
                    item.setReferrerName(extractReferrerName(entry.getKey()));
                    item.setCategory(categorizeReferrer(entry.getKey()));
                    return item;
                })
                .sorted((a, b) -> b.getCount() - a.getCount())
                .limit(10)
                .collect(Collectors.toList());
        vo.setReferrerStats(referrerStats);

        // 8. 设备类型分析
        DashboardStatsVO.DeviceStats deviceStats = new DashboardStatsVO.DeviceStats();
        int mobileCount = 0, desktopCount = 0, tabletCount = 0, unknownCount = 0;
        for (PageViewLog log : allLogs) {
            String device = DeviceTypeAnalyzer.detectDevice(log.getUserAgent());
            switch (device) {
                case "mobile": mobileCount++; break;
                case "tablet": tabletCount++; break;
                case "desktop": desktopCount++; break;
                default: unknownCount++;
            }
        }
        int total = allLogs.size();
        deviceStats.setMobileCount(mobileCount);
        deviceStats.setDesktopCount(desktopCount);
        deviceStats.setTabletCount(tabletCount);
        deviceStats.setUnknownCount(unknownCount);
        if (total > 0) {
            deviceStats.setMobilePercent((int) (mobileCount * 100.0 / total));
            deviceStats.setDesktopPercent((int) (desktopCount * 100.0 / total));
            deviceStats.setTabletPercent((int) (tabletCount * 100.0 / total));
        } else {
            deviceStats.setMobilePercent(0);
            deviceStats.setDesktopPercent(0);
            deviceStats.setTabletPercent(0);
        }
        vo.setDeviceStats(deviceStats);

        // 9. 跳出率分析（停留时长<5 秒视为跳出）
        DashboardStatsVO.BounceRateStats bounceRate = new DashboardStatsVO.BounceRateStats();
        int bounceCount = 0;
        int validDurationCount = 0;
        for (PageViewLog log : allLogs) {
            if (log.getDuration() != null && log.getDuration() > 0) {
                validDurationCount++;
                if (log.getDuration() < 5) {
                    bounceCount++;
                }
            }
        }
        bounceRate.setBounceCount(bounceCount);
        bounceRate.setTotalVisits(validDurationCount);
        if (validDurationCount > 0) {
            bounceRate.setBounceRate(Math.round(bounceCount * 100.0 / validDurationCount * 10.0) / 10.0);
        } else {
            bounceRate.setBounceRate(0.0);
        }
        bounceRate.setDescription("停留时长 < 5 秒的访问占比");
        vo.setBounceRate(bounceRate);

        // 10. 新老访客分析
        // 统计每个 ipHash 的首次访问日期
        Map<String, LocalDateTime> firstVisitByIp = new HashMap<>();
        for (PageViewLog log : allLogs) {
            String ipHash = log.getIpHash();
            if (!firstVisitByIp.containsKey(ipHash) ||
                log.getCreatedAt().isBefore(firstVisitByIp.get(ipHash))) {
                firstVisitByIp.put(ipHash, log.getCreatedAt());
            }
        }

        // 判断是否在时间范围之前有访问记录
        int newVisitorCount = 0;
        int returningVisitorCount = 0;

        for (Map.Entry<String, LocalDateTime> entry : firstVisitByIp.entrySet()) {
            LocalDateTime firstVisit = entry.getValue();
            // 如果首次访问在时间范围开始日期之前，则是老访客
            if (firstVisit.toLocalDate().isBefore(startDate)) {
                returningVisitorCount++;
            } else {
                newVisitorCount++;
            }
        }

        // 如果没有数据，使用当前时间范围内的访问模式估算
        if (newVisitorCount == 0 && returningVisitorCount == 0) {
            Set<String> uniqueIps = allLogs.stream().map(PageViewLog::getIpHash).collect(Collectors.toSet());
            newVisitorCount = uniqueIps.size();
        }

        int totalVisitors = newVisitorCount + returningVisitorCount;
        DashboardStatsVO.VisitorTypeStats visitorTypeStats = new DashboardStatsVO.VisitorTypeStats();
        visitorTypeStats.setNewVisitorCount(newVisitorCount);
        visitorTypeStats.setReturningVisitorCount(returningVisitorCount);
        if (totalVisitors > 0) {
            visitorTypeStats.setNewVisitorPercent((int) (newVisitorCount * 100.0 / totalVisitors));
            visitorTypeStats.setReturningVisitorPercent((int) (returningVisitorCount * 100.0 / totalVisitors));
        } else {
            visitorTypeStats.setNewVisitorPercent(0);
            visitorTypeStats.setReturningVisitorPercent(0);
        }
        vo.setVisitorTypeStats(visitorTypeStats);

        return vo;
    }

    private String buildTimeRangeLabel(LocalDate startDate, LocalDate endDate, Integer days) {
        LocalDate today = LocalDate.now();
        if (days == 1 && startDate.equals(today)) {
            return "今日";
        } else if (days == 7 && endDate.equals(today)) {
            return "近 7 天";
        } else if (days == 30 && endDate.equals(today)) {
            return "近 30 天";
        } else if (startDate.getMonthValue() == 1 && startDate.getDayOfMonth() == 1 &&
                   endDate.equals(today)) {
            return "本年";
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return startDate.format(formatter) + " ~ " + endDate.format(formatter);
        }
    }

    private String extractPageTitle(String pageUrl) {
        if (pageUrl == null || pageUrl.isEmpty()) {
            return "未知页面";
        }
        // 优先匹配更具体的路径：项目详情页 (/projects/:id)
        if (pageUrl.matches(".*/projects/\\d+.*")) {
            return "项目详情页";
        } else if (pageUrl.contains("/admin")) {
            return "管理后台";
        } else if (pageUrl.equals("/") || pageUrl.equals("/index")) {
            return "首页";
        } else if (pageUrl.equals("/projects") || pageUrl.contains("/projects?") || pageUrl.equals("/projects/")) {
            return "项目列表";
        } else if (pageUrl.contains("/about")) {
            return "关于我们";
        } else if (pageUrl.contains("/contact")) {
            return "联系我们";
        } else {
            String[] parts = pageUrl.split("/");
            if (parts.length > 0 && !parts[parts.length - 1].isEmpty()) {
                return parts[parts.length - 1];
            }
            return pageUrl;
        }
    }

    private String formatDuration(int seconds) {
        int minutes = seconds / 60;
        int secs = seconds % 60;
        if (minutes > 0) {
            return minutes + "分" + secs + "秒";
        }
        return secs + "秒";
    }

    private String extractReferrerName(String referrer) {
        if (referrer == null || referrer.isEmpty() || referrer.equals("(直接访问)")) {
            return "直接访问";
        }
        try {
            java.net.URI uri = new java.net.URI(referrer);
            String host = uri.getHost();
            if (host != null) {
                String domain = host.replace("www.", "");
                if (domain.contains("google")) return "Google 搜索";
                if (domain.contains("baidu")) return "百度搜索";
                if (domain.contains("bing")) return "Bing 搜索";
                if (domain.contains("sogou")) return "搜狗搜索";
                if (domain.contains("so.com") || domain.contains("360")) return "360 搜索";
                if (domain.contains("wechat") || domain.contains("weixin")) return "微信";
                if (domain.contains("douyin") || domain.contains("iesdouyin")) return "抖音";
                if (domain.contains("weibo")) return "微博";
                if (domain.contains("xiaohongshu") || domain.contains("xhs")) return "小红书";
                return domain;
            }
        } catch (Exception e) {
            // 忽略解析错误
        }
        return referrer;
    }

    private String categorizeReferrer(String referrer) {
        if (referrer == null || referrer.isEmpty() || referrer.equals("(直接访问)")) {
            return "direct";
        }
        String lower = referrer.toLowerCase();
        if (lower.contains("google") || lower.contains("baidu") || lower.contains("bing") ||
            lower.contains("sogou") || lower.contains("so.com") || lower.contains("360")) {
            return "search";
        }
        if (lower.contains("wechat") || lower.contains("weixin") || lower.contains("douyin") ||
            lower.contains("weibo") || lower.contains("xiaohongshu") || lower.contains("xhs") ||
            lower.contains("tiktok") || lower.contains("facebook") || lower.contains("twitter")) {
            return "social";
        }
        return "external";
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return input;
        }
    }
}
