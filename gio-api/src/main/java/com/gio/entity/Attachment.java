package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 附件实体
 */
@Data
@TableName("attachment")
public class Attachment {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 业务类型（如 project_image）
     */
    private String businessType;

    /**
     * 业务ID
     */
    private Integer businessId;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 文件类型
     */
    private String fileType;

    /**
     * 文件大小（字节）
     */
    private Integer fileSize;

    /**
     * Base64 数据
     */
    private String base64Data;

    /**
     * 宽度
     */
    private Integer width;

    /**
     * 高度
     */
    private Integer height;

    /**
     * 缩略图 Base64 数据
     */
    private String thumbnailData;

    /**
     * 缩略图宽度
     */
    private Integer thumbnailWidth;

    /**
     * 缩略图高度
     */
    private Integer thumbnailHeight;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}