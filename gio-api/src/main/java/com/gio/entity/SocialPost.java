package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 小红书推文实体类
 */
@Data
@TableName("social_post")
public class SocialPost {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 类型: project/custom
     */
    private String type;

    /**
     * 关联项目ID（type=project时）
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
     * 标签（逗号分隔）
     */
    private String tags;

    /**
     * 选中的项目图片ID列表（JSON数组）
     */
    private String selectedImages;

    /**
     * 自定义上传的图片信息（JSON数组）
     */
    private String customImages;

    /**
     * 状态: 0-草稿 1-已发布
     */
    private Integer status;

    /**
     * 发布平台
     */
    private String publishPlatform;

    /**
     * 发布后的链接
     */
    private String publishUrl;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除: 0-未删除 1-已删除
     */
    private Integer deleted;
}