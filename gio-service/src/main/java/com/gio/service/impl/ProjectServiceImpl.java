package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
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
    public PageResult<ProjectListItemDTO> getProjectList(Integer page, Integer size, Integer categoryId) {
        if (page == null || page <= 0) page = 1;
        if (size == null || size <= 0) size = 10;

        Page<Project> projectPage = new Page<>(page, size);

        // 构建查询条件（后台可以看到所有项目，包括草稿）
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Project>();
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }
        queryWrapper.orderByAsc("sort_order").orderByDesc("id");

        Page<Project> resultPage = this.page(projectPage, queryWrapper);

        // 转换为 DTO
        List<ProjectListItemDTO> dtoList = resultPage.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PageResult.of(dtoList, resultPage.getTotal(), page, size);
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

    private ProjectListItemDTO convertToDTO(Project project) {
        ProjectListItemDTO dto = new ProjectListItemDTO();
        dto.setId(project.getId());
        dto.setCategoryId(project.getCategoryId());
        dto.setName(project.getName());
        dto.setLocation(project.getLocation());
        dto.setYear(project.getYear());
        dto.setViewCount(project.getViewCount());
        dto.setStatus(project.getStatus());

        // 获取分类名称
        Category category = categoryService.getById(project.getCategoryId());
        if (category != null) {
            dto.setCategoryName(category.getName());
        }

        // 获取封面图
        if (project.getCoverImageId() != null) {
            dto.setCoverImageId(project.getCoverImageId());
        }

        return dto;
    }
}
