package com.gio.dto;

import lombok.Data;

/**
 * 项目详情 DTO（包含分类信息和图片列表）
 */
@Data
public class ProjectDetailDTO {

    private Integer id;

    private Integer categoryId;

    private String categoryName;

    private String categoryNameEn;

    private String name;

    private String location;

    private String year;

    private String description;

    private Integer coverImageId;

    private Integer sortOrder;

    private Integer viewCount;

    private java.util.List<ImageInfo> images;

    @Data
    public static class ImageInfo {
        private Integer id;
        private Integer attachmentId;
        private String imageName;
        private Integer width;
        private Integer height;
        private Integer fileSize;
        private Integer isCover;
    }
}
