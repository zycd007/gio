package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 项目分类实体类
 */
@Data
@TableName("category")
public class Category {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @NotBlank(message = "分类名称不能为空")
    @Size(max = 50, message = "分类名称不能超过50个字符")
    private String name;

    @Size(max = 50, message = "英文名称不能超过50个字符")
    private String nameEn;

    @NotBlank(message = "分类代码不能为空")
    @Size(max = 20, message = "分类代码不能超过20个字符")
    private String code;

    /**
     * 核心设计亮点
     */
    @TableField("design_highlights")
    private String designHighlights;

    /**
     * 适配场景
     */
    @TableField("suitable_scenes")
    private String suitableScenes;

    @TableField("sort_order")
    private Integer sortOrder;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
