package com.gio.dto;

import lombok.Data;

/**
 * 自由创作推文请求 DTO
 */
@Data
public class FreeCopywritingRequest {

    /**
     * 图片 URL 列表（JSON 字符串）
     */
    private String customImages;

    /**
     * 用户描述
     */
    private String description;

    /**
     * 文案风格
     */
    private String style = "professional";
}
