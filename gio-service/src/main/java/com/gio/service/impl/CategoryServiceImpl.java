package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.entity.Category;
import com.gio.mapper.CategoryMapper;
import com.gio.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 分类服务实现
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public List<Category> getEnabledCategories() {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Category>();
        queryWrapper.eq("status", 1).orderByAsc("sort_order");
        return this.list(queryWrapper);
    }

    @Override
    public List<Category> getAllCategories() {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Category>();
        queryWrapper.orderByAsc("sort_order");
        return this.list(queryWrapper);
    }
}
