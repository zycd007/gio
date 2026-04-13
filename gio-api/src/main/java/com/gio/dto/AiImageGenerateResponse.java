package com.gio.dto;

import lombok.Data;
import java.util.List;

/**
 * AI配图生成响应
 */
@Data
public class AiImageGenerateResponse {

    /**
     * 状态: 0-未开始 1-生成中 2-完成 3-失败
     */
    private Integer status;

    /**
     * 目标生成数量
     */
    private Integer totalCount;

    /**
     * 已完成数量
     */
    private Integer completedCount;

    /**
     * 状态消息
     */
    private String message;

    /**
     * 生成的图片信息
     */
    private List<AiImageInfo> images;

    /**
     * AI配图信息
     */
    @Data
    public static class AiImageInfo {
        /**
         * 图片附件ID
         */
        private Integer attachmentId;

        /**
         * 图片访问URL
         */
        private String url;

        /**
         * 生成提示词
         */
        private String prompt;

        /**
         * 排序顺序
         */
        private Integer order;
    }
}