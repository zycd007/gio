package com.gio.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 推文 DTO
 */
@Data
public class CopywritingDTO {

    /**
     * 推文 ID
     */
    private Integer id;

    /**
     * 关联项目 ID
     */
    private Integer projectId;

    /**
     * 项目名称（关联时填充）
     */
    private String projectName;

    /**
     * 项目封面图 URL
     */
    private String projectCoverImage;

    /**
     * 推文标题
     */
    private String title;

    /**
     * 推文正文
     */
    private String content;

    /**
     * 标签列表
     */
    private List<String> tags;

    /**
     * 文案风格
     */
    private String style;

    /**
     * 来源类型：1-项目生成 2-自由创作
     */
    private Integer sourceType;

    /**
     * 自由创作图片 URL 列表
     */
    private List<String> customImages;

    /**
     * 自由创作描述
     */
    private String customDescription;

    /**
     * 状态：0-草稿 1-已发布
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 风格显示名称
     */
    private String styleName;
}
