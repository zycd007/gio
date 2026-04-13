package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@TableName("daily_stats")
public class DailyStats {
    @TableId(type = IdType.AUTO)
    private Long id;
    private LocalDate statDate;
    private Integer totalUv;
    private Integer totalPv;
    private Integer projectId;
    private Integer viewCount;
}
