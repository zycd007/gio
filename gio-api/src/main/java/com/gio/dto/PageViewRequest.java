package com.gio.dto;

import lombok.Data;

@Data
public class PageViewRequest {
    private String pageUrl;
    private String referrer;
    private Integer projectId;
    private Integer duration;  // 用于 duration 接口
}
