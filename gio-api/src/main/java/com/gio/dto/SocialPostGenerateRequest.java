package com.gio.dto;

import lombok.Data;
import java.util.List;

/**
 * 生成推文请求DTO
 */
@Data
public class SocialPostGenerateRequest {

    /**
     * 类型: project 或 custom
     */
    private String type;

    /**
     * 项目ID（type=project时必填）
     */
    private Integer projectId;

    /**
     * 选中的项目图片ID列表
     */
    private List<Integer> selectedImageIds;

    /**
     * 自定义内容描述（type=custom时必填）
     */
    private String customContent;

    /**
     * 自定义图片附件ID列表
     */
    private List<Integer> customImageIds;
}