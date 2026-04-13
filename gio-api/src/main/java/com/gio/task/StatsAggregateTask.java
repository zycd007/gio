package com.gio.task;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.gio.entity.DailyStats;
import com.gio.entity.PageViewLog;
import com.gio.mapper.DailyStatsMapper;
import com.gio.mapper.PageViewLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class StatsAggregateTask {

    @Autowired
    private PageViewLogMapper pageViewLogMapper;

    @Autowired
    private DailyStatsMapper dailyStatsMapper;

    /**
     * 每日凌晨2点执行，汇总昨天的数据到 daily_stats
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void aggregateDailyStats() {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 汇总全局统计 (project_id = 0)
        aggregateGlobalStats(yesterday);

        // 汇总各项目统计 (project_id > 0)
        aggregateProjectStats(yesterday);

        // 清理30天前的数据
        cleanupOldData();
    }

    private void aggregateGlobalStats(LocalDate date) {
        // 检查是否已汇总
        var existingWrapper = new QueryWrapper<DailyStats>()
                .eq("stat_date", date)
                .eq("project_id", 0);
        if (dailyStatsMapper.selectCount(existingWrapper) > 0) {
            return;
        }

        // 查询所有该日期的全局记录
        var logQuery = new QueryWrapper<PageViewLog>()
                .eq("visit_date", date)
                .eq("project_id", 0);
        List<PageViewLog> logs = pageViewLogMapper.selectList(logQuery);

        long pv = logs.size();
        long uv = logs.stream().map(PageViewLog::getIpHash).distinct().count();

        DailyStats stats = new DailyStats();
        stats.setStatDate(date);
        stats.setTotalUv((int) uv);
        stats.setTotalPv((int) pv);
        stats.setProjectId(0);
        stats.setViewCount(0);
        dailyStatsMapper.insert(stats);
    }

    private void aggregateProjectStats(LocalDate date) {
        var logQuery = new QueryWrapper<PageViewLog>()
                .eq("visit_date", date)
                .ne("project_id", 0);
        List<PageViewLog> logs = pageViewLogMapper.selectList(logQuery);

        // 按 projectId 分组统计
        java.util.Map<Integer, java.util.List<PageViewLog>> byProject = logs.stream()
                .collect(java.util.stream.Collectors.groupingBy(PageViewLog::getProjectId));

        for (var entry : byProject.entrySet()) {
            Integer projectId = entry.getKey();
            List<PageViewLog> projectLogs = entry.getValue();

            var existingWrapper = new QueryWrapper<DailyStats>()
                    .eq("stat_date", date)
                    .eq("project_id", projectId);
            if (dailyStatsMapper.selectCount(existingWrapper) > 0) {
                continue;
            }

            int viewCount = projectLogs.size();
            DailyStats stats = new DailyStats();
            stats.setStatDate(date);
            stats.setProjectId(projectId);
            stats.setViewCount(viewCount);
            stats.setTotalUv(0);
            stats.setTotalPv(0);
            dailyStatsMapper.insert(stats);
        }
    }

    private void cleanupOldData() {
        LocalDate cutoff = LocalDate.now().minusDays(30);
        var logWrapper = new QueryWrapper<PageViewLog>().lt("visit_date", cutoff);
        pageViewLogMapper.delete(logWrapper);
        var statsWrapper = new QueryWrapper<DailyStats>().lt("stat_date", cutoff);
        dailyStatsMapper.delete(statsWrapper);
    }
}
