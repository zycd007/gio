package com.gio.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Project;

import java.util.List;

/**
 * 项目服务接口
 */
public interface ProjectService extends IService<Project> {

    /**
     * 分页获取项目列表
     */
    PageResult<ProjectListItemDTO> getProjectList(Integer page, Integer size, Integer categoryId);

    /**
     * 获取项目详情
     */
    ProjectDetailDTO getProjectDetail(Integer id);

    /**
     * 增加浏览次数
     */
    void incrementViewCount(Integer id);

    /**
     * 获取分类下的所有项目（用于后台）
     */
    List<Project> getProjectsByCategory(Integer categoryId);
}
