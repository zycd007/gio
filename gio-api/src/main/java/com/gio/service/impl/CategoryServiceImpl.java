package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.dto.DashboardStatsDTO;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.entity.SocialPost;
import com.gio.mapper.CategoryMapper;
import com.gio.mapper.SocialPostMapper;
import com.gio.service.CategoryService;
import com.gio.service.ImageService;
import com.gio.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 分类服务实现
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Autowired
    @Lazy
    private ProjectService projectService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private SocialPostMapper socialPostMapper;

    @Override
    public List<Category> getEnabledCategories() {
        var queryWrapper = new QueryWrapper<Category>();
        queryWrapper.eq("status", 1).orderByAsc("sort_order");
        return this.list(queryWrapper);
    }

    @Override
    public List<Category> getAllCategories() {
        var queryWrapper = new QueryWrapper<Category>();
        queryWrapper.orderByAsc("sort_order");
        return this.list(queryWrapper);
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // 项目总数
        QueryWrapper<Project> projectWrapper = new QueryWrapper<>();
        stats.setTotalProjects(projectService.count(projectWrapper));

        // 已发布项目数
        QueryWrapper<Project> publishedWrapper = new QueryWrapper<>();
        publishedWrapper.eq("status", 1);
        stats.setPublishedProjects(projectService.count(publishedWrapper));

        // 推文总数（未删除的）
        QueryWrapper<SocialPost> postWrapper = new QueryWrapper<>();
        postWrapper.eq("deleted", 0);
        stats.setTotalSocialPosts(socialPostMapper.selectCount(postWrapper));

        // 图片总数
        stats.setTotalImages(imageService.getTotalImageCount());

        return stats;
    }
}
