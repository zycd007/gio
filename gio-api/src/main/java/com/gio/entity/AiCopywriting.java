package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * AI 推文实体类
 */
@Data
@TableName("ai_copywriting")
public class AiCopywriting {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 关联项目 ID，自由创作时为 NULL
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
     * 标签列表，JSON 格式存储
     */
    private String tags;

    /**
     * 文案风格：professional/seed/story/minimal
     */
    private String style;

    /**
     * 来源类型：1-项目生成 2-自由创作
     */
    @TableField("source_type")
    private Integer sourceType;

    /**
     * 自由创作模式下的图片 URL，JSON 数组
     */
    @TableField("custom_images")
    private String customImages;

    /**
     * 自由创作模式下的用户描述
     */
    @TableField("custom_description")
    private String customDescription;

    /**
     * 状态：0-草稿 1-已发布
     */
    private Integer status;

    /**
     * 消耗 Token 数
     */
    @TableField("tokens_used")
    private Integer tokensUsed;

    /**
     * 逻辑删除：0-未删除 1-已删除
     */
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
