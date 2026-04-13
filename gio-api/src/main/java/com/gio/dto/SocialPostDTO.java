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
    private List<AiImageInfo> aiImages;
    private String aiImagePrompt;
    private Integer aiImageCount;
    private Integer aiImageStatus;
    private Integer status;
    private String publishPlatform;
    private String publishUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * AI配图信息
     */
    @Data
    public static class AiImageInfo {
        private Integer attachmentId;
        private String url;
        private String prompt;
        private String generatedAt;
        private String source;
        private Integer order;
    }
}