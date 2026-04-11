package com.gio.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 推文列表项DTO
 */
@Data
public class SocialPostListItemDTO {

    private Integer id;
    private String type;
    private Integer projectId;
    private String projectName;
    private String title;
    private Integer status;
    private LocalDateTime createdAt;
}