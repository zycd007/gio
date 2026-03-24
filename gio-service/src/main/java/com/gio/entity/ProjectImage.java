package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 项目图片实体类
 */
@Data
@TableName("project_image")
public class ProjectImage {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer projectId;

    private String imageName;

    @TableField("attachment_id")
    private Integer attachmentId;

    @TableField(exist = false)
    private byte[] imageData;

    private String imageType;

    private Integer fileSize;

    private Integer width;

    private Integer height;

    @TableField("is_cover")
    private Integer isCover;

    @TableField("sort_order")
    private Integer sortOrder;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
