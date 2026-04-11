package com.gio.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 推文详情DTO
 */
@Data
public class SocialPostDTO {

    private Integer id;
    private String type;
    private Integer projectId;
    private String projectName;
    private String title;
    private String content;
    private String tags;
    private List<Integer> selectedImages;
    private Integer status;
    private String publishPlatform;
    private String publishUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}