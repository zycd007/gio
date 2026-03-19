package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Category;
import com.gio.service.CategoryService;
import com.gio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公开接口 - 项目和分类
 */
@RestController
@RequestMapping("/api")
public class PublicController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProjectService projectService;

    /**
     * 获取 API 信息
     */
    @GetMapping("/")
    public Result<String> getApiInfo() {
        return Result.success("GIO API Server - 使用 /api/categories 或 /api/projects 访问数据");
    }

    /**
     * 获取所有分类
     */
    @GetMapping("/categories")
    public Result<List<Category>> getCategories() {
        List<Category> categories = categoryService.getEnabledCategories();
        return Result.success(categories);
    }

    /**
     * 获取项目列表
     */
    @GetMapping("/projects")
    public Result<PageResult<ProjectListItemDTO>> getProjects(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer categoryId) {
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(page, size, categoryId);
        return Result.success(result);
    }

    /**
     * 获取项目详情
     */
    @GetMapping("/projects/{id}")
    public Result<ProjectDetailDTO> getProjectDetail(@PathVariable Integer id) {
        ProjectDetailDTO dto = projectService.getProjectDetail(id);
        if (dto == null) {
            return Result.error(404, "项目不存在");
        }
        return Result.success(dto);
    }
}
