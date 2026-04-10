package com.gio.dto;

import lombok.Data;

/**
 * 图片排序 DTO
 */
@Data
public class ImageSortDTO {

    /**
     * 图片 ID
     */
    private Integer imageId;

    /**
     * 排序顺序
     */
    private Integer sortOrder;
}