package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.DashboardStatsDTO;
import com.gio.dto.DashboardStatsVO;
import com.gio.service.CategoryService;
import com.gio.service.TrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * 后台管理 - 仪表盘
 */
@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private TrackService trackService;

    /**
     * 获取仪表盘统计数据
     */
    @GetMapping("/dashboard/stats")
    public Result<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = categoryService.getDashboardStats();
        return Result.success(stats);
    }

    /**
     * 获取分析数据（UV/PV 趋势、项目排行）
     * @param days 时间范围天数（7、30 等），与 startDate/endDate 互斥
     * @param startDate 开始日期（可选，与 endDate 一起使用）
     * @param endDate 结束日期（可选，与 startDate 一起使用）
     */
    @GetMapping("/dashboard/analytics")
    public Result<DashboardStatsVO> getAnalytics(
            @RequestParam(defaultValue = "7") Integer days,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    ) {
        DashboardStatsVO vo;
        if (startDate != null && endDate != null) {
            vo = trackService.getDashboardAnalyticsByRange(startDate, endDate);
        } else {
            vo = trackService.getDashboardAnalytics(days);
        }
        return Result.success(vo);
    }
}
