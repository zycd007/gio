package com.gio.dto;

import lombok.Data;

/**
 * 分页响应数据
 */
@Data
public class PageResult<T> {

    private java.util.List<T> list;

    private Long total;

    private Integer page;

    private Integer size;

    private Integer totalPages;

    public PageResult(java.util.List<T> list, Long total, Integer page, Integer size) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = (int) Math.ceil((double) total / size);
    }

    public static <T> PageResult<T> of(java.util.List<T> list, Long total, Integer page, Integer size) {
        return new PageResult<>(list, total, page, size);
    }
}
