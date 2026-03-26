package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Project;
import com.gio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 后台管理 - 项目管理
 */
@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * 获取项目列表（分页，含草稿）
     */
    @GetMapping
    public Result<PageResult<ProjectListItemDTO>> getProjects(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String keyword) {
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(page, size, categoryId, keyword);
        return Result.success(result);
    }

    /**
     * 获取项目详情
     */
    @GetMapping("/{id}")
    public Result<ProjectDetailDTO> getProject(@PathVariable Integer id) {
        ProjectDetailDTO dto = projectService.getProjectDetail(id);
        if (dto == null) {
            return Result.error(404, "项目不存在");
        }
        return Result.success(dto);
    }

    /**
     * 创建项目
     */
    @PostMapping
    public Result<Project> createProject(@RequestBody Project project) {
        projectService.save(project);
        return Result.success(project);
    }

    /**
     * 更新项目
     */
    @PutMapping("/{id}")
    public Result<Project> updateProject(@PathVariable Integer id, @RequestBody Project project) {
        project.setId(id);
        projectService.updateById(project);
        return Result.success(project);
    }

    /**
     * 删除项目
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteProject(@PathVariable Integer id) {
        boolean success = projectService.deleteProjectWithImages(id);
        if (!success) {
            return Result.error(404, "项目不存在");
        }
        return Result.success();
    }

    /**
     * 获取分类下的所有项目
     */
    @GetMapping("/category/{categoryId}")
    public Result<List<Project>> getProjectsByCategory(@PathVariable Integer categoryId) {
        List<Project> projects = projectService.getProjectsByCategory(categoryId);
        return Result.success(projects);
    }

    /**
     * 更新项目状态（发布/下架）
     */
    @PutMapping("/{id}/status")
    public Result<Void> updateProjectStatus(@PathVariable Integer id, @RequestParam Integer status) {
        boolean success = projectService.updateProjectStatus(id, status);
        if (!success) {
            return Result.error(404, "项目不存在");
        }
        return Result.success();
    }
}
