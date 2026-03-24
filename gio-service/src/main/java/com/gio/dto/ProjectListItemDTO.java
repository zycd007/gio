package com.gio.dto;

import lombok.Data;

/**
 * 项目列表项 DTO
 */
@Data
public class ProjectListItemDTO {

    private Integer id;

    private Integer categoryId;

    private String categoryName;

    private String name;

    private String location;

    private String year;

    private String coverImagePath;

    private Integer coverImageId;

    private Integer viewCount;

    private Integer status;
}
