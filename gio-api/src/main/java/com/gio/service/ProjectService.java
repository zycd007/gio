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
PageResult<ProjectListItemDTO> getProjectList(Integer page, Integer size, Integer categoryId, String keyword, Integer isFeatured, Integer status);

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

    /**
     * 更新项目状态（发布/下架）
     */
    boolean updateProjectStatus(Integer id, Integer status);

    /**
     * 删除项目（级联删除图片）
     */
    boolean deleteProjectWithImages(Integer id);

    /**
     * 获取精选项目列表
     */
    List<ProjectListItemDTO> getFeaturedProjects();

    /**
     * 设置/取消精品项目
     * @param id 项目ID
     * @param isFeatured 1-设为精品 0-取消精品
     * @return 是否成功
     */
    boolean setProjectFeatured(Integer id, Integer isFeatured);

    /**
     * 获取当前精品项目数量
     */
    long getFeaturedCount();

    /**
     * 批量更新项目状态
     */
    void batchUpdateStatus(List<Integer> ids, Integer status);

    /**
     * 批量设置/取消精品
     */
    void batchSetFeatured(List<Integer> ids, Integer isFeatured);

    /**
     * 批量删除项目
     */
    void batchDelete(List<Integer> ids);

    /**
     * 批量更新项目排序
     * @param sortList 排序列表，包含项目ID和排序序号
     */
    void updateSortOrder(List<com.gio.dto.ProjectSortDTO> sortList);
}
