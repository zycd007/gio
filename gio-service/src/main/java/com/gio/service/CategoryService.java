package com.gio.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gio.entity.Category;
import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService extends IService<Category> {

    /**
     * 获取所有启用的分类（按排序）
     */
    List<Category> getEnabledCategories();

    /**
     * 获取所有分类（含禁用，用于后台）
     */
    List<Category> getAllCategories();
}
