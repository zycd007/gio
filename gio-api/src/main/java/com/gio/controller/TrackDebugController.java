package com.gio.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.gio.common.Result;
import com.gio.entity.PageViewLog;
import com.gio.mapper.PageViewLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 埋点调试接口 - 用于诊断和监控埋点数据
 */
@RestController
@RequestMapping("/api/admin/track")
public class TrackDebugController {

    @Autowired
    private PageViewLogMapper pageViewLogMapper;

    /**
     * 获取埋点系统状态
     */
    @GetMapping("/status")
    public Result<?> getTrackStatus() {
        Map<String, Object> status = new HashMap<>();

        // 今日统计
        LocalDate today = LocalDate.now();
        QueryWrapper<PageViewLog> todayQuery = new QueryWrapper<PageViewLog>()
                .eq("visit_date", today);
        long todayPv = pageViewLogMapper.selectCount(todayQuery);
        status.put("todayPv", todayPv);

        // 昨日统计
        LocalDate yesterday = today.minusDays(1);
        QueryWrapper<PageViewLog> yesterdayQuery = new QueryWrapper<PageViewLog>()
                .eq("visit_date", yesterday);
        long yesterdayPv = pageViewLogMapper.selectCount(yesterdayQuery);
        status.put("yesterdayPv", yesterdayPv);

        // 近7天统计
        LocalDate weekAgo = today.minusDays(7);
        QueryWrapper<PageViewLog> weekQuery = new QueryWrapper<PageViewLog>()
                .ge("visit_date", weekAgo)
                .le("visit_date", today);
        long weekPv = pageViewLogMapper.selectCount(weekQuery);
        status.put("weekPv", weekPv);

        // 总记录数
        long totalCount = pageViewLogMapper.selectCount(null);
        status.put("totalCount", totalCount);

        // 系统状态
        status.put("status", "ok");
        status.put("message", "埋点系统运行正常");

        return Result.success(status);
    }

    /**
     * 获取指定日期范围的埋点数据概览
     */
    @GetMapping("/summary")
    public Result<?> getTrackSummary(@RequestParam(required = false) String startDate,
                                     @RequestParam(required = false) String endDate) {
        QueryWrapper<PageViewLog> query = new QueryWrapper<>();

        if (startDate != null && !startDate.isEmpty()) {
            query.ge("visit_date", startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            query.le("visit_date", endDate);
        }

        long count = pageViewLogMapper.selectCount(query);
        return Result.success(Map.of(
                "count", count,
                "startDate", startDate != null ? startDate : "无限制",
                "endDate", endDate != null ? endDate : "无限制"
        ));
    }
}
