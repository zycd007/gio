package com.gio.dto;

import lombok.Data;

/**
 * AI配图生成请求
 */
@Data
public class AiImageGenerateRequest {

    /**
     * 生成数量（1-9）
     */
    private Integer imageCount;

    /**
     * 可选的风格提示词（如"现代简约"、"温馨氛围"）
     */
    private String stylePrompt;
}