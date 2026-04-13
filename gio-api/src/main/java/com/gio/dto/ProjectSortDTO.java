package com.gio.dto;

import lombok.Data;

/**
 * 项目排序更新 DTO
 */
@Data
public class ProjectSortDTO {
    /**
     * 项目 ID
     */
    private Integer projectId;

    /**
     * 排序序号
     */
    private Integer sortOrder;
}