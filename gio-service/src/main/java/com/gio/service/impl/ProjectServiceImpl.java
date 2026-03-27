package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.common.Result;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.entity.ProjectImage;
import com.gio.mapper.ProjectMapper;
import com.gio.service.CategoryService;
import com.gio.service.ImageService;
import com.gio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 项目服务实现
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ImageService imageService;

    @Override
    public PageResult<ProjectListItemDTO> getProjectList(Integer page, Integer size, Integer categoryId, String keyword) {
        if (page == null || page <= 0) page = 1;
        if (size == null || size <= 0) size = 10;

        Page<Project> projectPage = new Page<>(page, size);

        // 只查询列表需要的字段，减少数据传输
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Project>();
        queryWrapper.select("id", "category_id", "name", "location", "year", "cover_image_id", "view_count", "status", "is_featured", "sort_order");
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("name", keyword.trim());
        }
        queryWrapper.orderByAsc("sort_order").orderByDesc("id");

        Page<Project> resultPage = this.page(projectPage, queryWrapper);

        // 批量获取分类信息，避免 N+1 查询
        List<Project> projects = resultPage.getRecords();
        if (!projects.isEmpty()) {
            List<Integer> categoryIds = projects.stream()
                    .map(Project::getCategoryId)
                    .distinct()
                    .collect(Collectors.toList());
            List<Category> categories = categoryService.listByIds(categoryIds);
            final java.util.Map<Integer, Category> categoryMap = categories.stream()
                    .collect(Collectors.toMap(Category::getId, c -> c));

            // 转换为 DTO，使用已查询的分类数据
            List<ProjectListItemDTO> dtoList = projects.stream()
                    .map(p -> convertToDTO(p, categoryMap))
                    .collect(Collectors.toList());

            return PageResult.of(dtoList, resultPage.getTotal(), page, size);
        }

        return PageResult.of(new ArrayList<>(), resultPage.getTotal(), page, size);
    }

    @Override
    public ProjectDetailDTO getProjectDetail(Integer id) {
        Project project = this.getById(id);
        if (project == null) {
            return null;
        }

        // 增加浏览次数
        incrementViewCount(id);

        // 转换为 DTO
        ProjectDetailDTO dto = new ProjectDetailDTO();
        dto.setId(project.getId());
        dto.setCategoryId(project.getCategoryId());
        dto.setName(project.getName());
        dto.setLocation(project.getLocation());
        dto.setYear(project.getYear());
        dto.setDescription(project.getDescription());
        dto.setCoverImageId(project.getCoverImageId());
        dto.setSortOrder(project.getSortOrder());
        dto.setViewCount(project.getViewCount());

        // 获取分类信息
        Category category = categoryService.getById(project.getCategoryId());
        if (category != null) {
            dto.setCategoryName(category.getName());
            dto.setCategoryNameEn(category.getNameEn());
        }

        // 获取图片列表
        List<ProjectImage> images = imageService.getImagesByProject(id);
        List<ProjectDetailDTO.ImageInfo> imageInfos = images.stream()
                .map(img -> {
                    ProjectDetailDTO.ImageInfo info = new ProjectDetailDTO.ImageInfo();
                    info.setId(img.getId());
                    info.setAttachmentId(img.getAttachmentId());
                    info.setImageName(img.getImageName());
                    info.setWidth(img.getWidth());
                    info.setHeight(img.getHeight());
                    info.setFileSize(img.getFileSize());
                    info.setIsCover(img.getIsCover());
                    return info;
                })
                .collect(Collectors.toList());
        dto.setImages(imageInfos);

        return dto;
    }

    @Override
    @Transactional
    public void incrementViewCount(Integer id) {
        this.lambdaUpdate()
                .eq(Project::getId, id)
                .setSql("view_count = view_count + 1")
                .update();
    }

    @Override
    public List<Project> getProjectsByCategory(Integer categoryId) {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Project>();
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }
        queryWrapper.orderByAsc("sort_order").orderByDesc("id");
        return this.list(queryWrapper);
    }

    @Override
    public boolean updateProjectStatus(Integer id, Integer status) {
        Project project = this.getById(id);
        if (project == null) {
            return false;
        }
        project.setStatus(status);
        return this.updateById(project);
    }

    @Override
    @Transactional
    public boolean deleteProjectWithImages(Integer id) {
        // 先删除项目的所有图片
        imageService.deleteImagesByProject(id);
        // 再删除项目
        return this.removeById(id);
    }

    @Override
    public List<ProjectListItemDTO> getFeaturedProjects() {
        List<Project> projects = this.lambdaQuery()
                .eq(Project::getIsFeatured, 1)
                .eq(Project::getStatus, 1)
                .select(Project.class, info -> !"description".equals(info.getColumn())) // 不查询 description
                .orderByAsc(Project::getSortOrder)
                .list();

        // 批量获取分类信息
        if (!projects.isEmpty()) {
            List<Integer> categoryIds = projects.stream()
                    .map(Project::getCategoryId)
                    .distinct()
                    .collect(Collectors.toList());
            List<Category> categories = categoryService.listByIds(categoryIds);
            final java.util.Map<Integer, Category> categoryMap = categories.stream()
                    .collect(Collectors.toMap(Category::getId, c -> c));

            return projects.stream()
                    .map(p -> convertToDTO(p, categoryMap))
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private static final int MAX_FEATURED_COUNT = 6;

    @Override
    public Result<Void> setProjectFeatured(Integer id, Integer isFeatured) {
        Project project = this.getById(id);
        if (project == null) {
            return Result.error(404, "项目不存在");
        }

        // 如果是设为精品
        if (isFeatured == 1) {
            // 检查当前精品项目数量
            long currentCount = this.getFeaturedCount();
            if (currentCount >= MAX_FEATURED_COUNT && project.getIsFeatured() != 1) {
                return Result.error(400, "最多设置 " + MAX_FEATURED_COUNT + " 个精品项目");
            }
        }

        project.setIsFeatured(isFeatured);
        this.updateById(project);
        return Result.success();
    }

    @Override
    public long getFeaturedCount() {
        return this.lambdaQuery()
                .eq(Project::getIsFeatured, 1)
                .count();
    }

    private ProjectListItemDTO convertToDTO(Project project) {
        // 单个查询方式（保留用于其他场景）
        return convertToDTO(project, null);
    }

    private ProjectListItemDTO convertToDTO(Project project, java.util.Map<Integer, Category> categoryMap) {
        ProjectListItemDTO dto = new ProjectListItemDTO();
        dto.setId(project.getId());
        dto.setCategoryId(project.getCategoryId());
        dto.setName(project.getName());
        dto.setLocation(project.getLocation());
        dto.setYear(project.getYear());
        dto.setViewCount(project.getViewCount());
        dto.setStatus(project.getStatus());
        dto.setIsFeatured(project.getIsFeatured());

        // 获取分类名称
        if (categoryMap != null && categoryMap.containsKey(project.getCategoryId())) {
            dto.setCategoryName(categoryMap.get(project.getCategoryId()).getName());
        } else {
            // 备用：直接查询
            Category category = categoryService.getById(project.getCategoryId());
            if (category != null) {
                dto.setCategoryName(category.getName());
            }
        }

        // 获取封面图
        if (project.getCoverImageId() != null) {
            dto.setCoverImageId(project.getCoverImageId());
        }

        return dto;
    }
}
