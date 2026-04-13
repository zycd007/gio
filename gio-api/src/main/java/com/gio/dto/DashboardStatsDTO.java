package com.gio.dto;

import lombok.Data;

/**
 * 仪表盘统计数据
 */
@Data
public class DashboardStatsDTO {

    /**
     * 项目总数
     */
    private Long totalProjects;

    /**
     * 已发布项目数
     */
    private Long publishedProjects;

    /**
     * 推文总数
     */
    private Long totalSocialPosts;

    /**
     * 图片总数
     */
    private Long totalImages;
}