package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull(message = "分类ID不能为空")
    private Integer categoryId;

    @NotBlank(message = "项目名称不能为空")
    @Size(max = 100, message = "项目名称不能超过100个字符")
    private String name;

    @Size(max = 100, message = "项目位置不能超过100个字符")
    private String location;

    @Size(max = 20, message = "年份不能超过20个字符")
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

    /**
     * 是否有 AI 推文：0-否 1-是
     */
    @TableField("has_copywriting")
    private Integer hasCopywriting;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
