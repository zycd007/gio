package com.gio.dto;

import lombok.Data;

/**
 * 创建推文请求 DTO
 */
@Data
public class CopywritingCreateRequest {

    /**
     * 关联项目 ID（项目生成模式必填）
     */
    private Integer projectId;

    /**
     * 推文标题
     */
    private String title;

    /**
     * 推文正文
     */
    private String content;

    /**
     * 标签列表（JSON 字符串）
     */
    private String tags;

    /**
     * 文案风格
     */
    private String style;

    /**
     * 来源类型：1-项目生成 2-自由创作
     */
    private Integer sourceType = 1;

    /**
     * 自由创作图片 URL（JSON 字符串）
     */
    private String customImages;

    /**
     * 自由创作描述
     */
    private String customDescription;

    /**
     * 状态：0-草稿 1-已发布
     */
    private Integer status = 0;
}
