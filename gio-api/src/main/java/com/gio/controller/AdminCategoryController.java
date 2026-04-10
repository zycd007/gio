package com.gio.controller;

import com.gio.common.Result;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.service.CategoryService;
import com.gio.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 后台管理 - 分类管理
 */
@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProjectService projectService;

    /**
     * 获取所有分类
     */
    @GetMapping
    public Result<List<Category>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return Result.success(categories);
    }

    /**
     * 获取单个分类
     */
    @GetMapping("/{id}")
    public Result<Category> getCategory(@PathVariable Integer id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error(404, "分类不存在");
        }
        return Result.success(category);
    }

    /**
     * 创建分类
     */
    @PostMapping
    public Result<Category> createCategory(@Valid @RequestBody Category category) {
        categoryService.save(category);
        return Result.success(category);
    }

    /**
     * 更新分类
     */
    @PutMapping("/{id}")
    public Result<Category> updateCategory(@PathVariable Integer id, @Valid @RequestBody Category category) {
        category.setId(id);
        categoryService.updateById(category);
        return Result.success(category);
    }

    /**
     * 删除分类
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Integer id) {
        // 检查是否有项目关联该分类
        List<Project> associatedProjects = projectService.getProjectsByCategory(id);
        if (associatedProjects != null && !associatedProjects.isEmpty()) {
            return Result.error(400, "该分类下有 " + associatedProjects.size() + " 个项目，无法删除");
        }
        categoryService.removeById(id);
        return Result.success();
    }
}
