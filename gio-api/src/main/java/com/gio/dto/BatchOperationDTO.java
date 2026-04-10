package com.gio.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * 批量操作请求 DTO
 */
@Data
public class BatchOperationDTO {
    @NotEmpty(message = "项目ID列表不能为空")
    private List<Integer> ids;

    @NotNull(message = "状态值不能为空")
    private Integer value;
}