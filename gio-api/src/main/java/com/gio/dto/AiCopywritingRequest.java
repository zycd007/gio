package com.gio.dto;

import lombok.Data;

/**
 * AI 文案生成请求 DTO
 */
@Data
public class AiCopywritingRequest {

    /**
     * 文案风格
     * - professional: 专业权威
     * - seed: 热情种草
     * - story: 叙事性
     * - minimal: 简洁克制
     */
    private String style = "professional";
}
