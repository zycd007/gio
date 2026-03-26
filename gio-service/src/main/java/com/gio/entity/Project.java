package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 项目实体类
 */
@Data
@TableName("project")
public class Project {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer categoryId;

    private String name;

    private String location;

    private String year;

    private String description;

    private Integer coverImageId;

    @TableField("sort_order")
    private Integer sortOrder;

    private Integer status;

    @TableField("view_count")
    private Integer viewCount;

    /**
     * 是否精选：0-普通 1-精选
     */
    @TableField("is_featured")
    private Integer isFeatured;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
