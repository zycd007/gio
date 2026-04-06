package com.gio.dto;

import lombok.Data;

/**
 * AI 文案生成响应 DTO
 */
@Data
public class AiCopywritingResponse {

    /**
     * 文案标题
     */
    private String title;

    /**
     * 文案正文
     */
    private String content;

    /**
     * 标签列表
     */
    private String[] tags;
}
