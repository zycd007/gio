package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@TableName("page_view_log")
public class PageViewLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String ipHash;
    private String pageUrl;
    private String referrer;
    private Integer projectId;
    private String userAgent;
    private Integer duration;
    private LocalDate visitDate;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
