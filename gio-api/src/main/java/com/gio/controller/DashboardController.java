package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.DashboardStatsDTO;
import com.gio.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 后台管理 - 仪表盘
 */
@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 获取仪表盘统计数据
     */
    @GetMapping("/dashboard/stats")
    public Result<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = categoryService.getDashboardStats();
        return Result.success(stats);
    }
}