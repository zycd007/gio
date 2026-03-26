package com.gio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Project;
import com.gio.service.ProjectService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 管理员项目管理 Controller 集成测试
 *
 * 测试覆盖：
 * - GET /api/admin/projects - 获取项目列表
 * - GET /api/admin/projects/{id} - 获取项目详情
 * - POST /api/admin/projects - 创建项目
 * - PUT /api/admin/projects/{id} - 更新项目
 * - DELETE /api/admin/projects/{id} - 删除项目
 * - GET /api/admin/projects/category/{categoryId} - 获取分类下项目
 */
@WebMvcTest(AdminProjectController.class)
@DisplayName("AdminProjectController 集成测试")
class AdminProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    // ==================== 获取项目列表测试 ====================

    @Test
    @DisplayName("获取项目列表 - 默认分页")
    void getProjects_DefaultPagination() throws Exception {
        // Arrange
        PageResult<ProjectListItemDTO> pageResult = new PageResult<>(
                Collections.emptyList(), 0, 1, 10);
        when(projectService.getProjectList(any(), any(), any())).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.page").value(1))
                .andExpect(jsonPath("$.data.size").value(10));
    }

    @Test
    @DisplayName("获取项目列表 - 自定义分页")
    void getProjects_CustomPagination() throws Exception {
        // Arrange
        PageResult<ProjectListItemDTO> pageResult = new PageResult<>(
                Collections.emptyList(), 20, 2, 5);
        when(projectService.getProjectList(2, 5, null)).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects")
                        .param("page", "2")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.page").value(2))
                .andExpect(jsonPath("$.data.size").value(5))
                .andExpect(jsonPath("$.data.total").value(20));
    }

    @Test
    @DisplayName("获取项目列表 - 分类筛选")
    void getProjects_WithCategoryFilter() throws Exception {
        // Arrange
        PageResult<ProjectListItemDTO> pageResult = new PageResult<>(
                Collections.emptyList(), 5, 1, 10);
        when(projectService.getProjectList(1, 10, 1)).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects")
                        .param("categoryId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    // ==================== 获取项目详情测试 ====================

    @Test
    @DisplayName("获取项目详情 - 成功")
    void getProject_Success() throws Exception {
        // Arrange
        ProjectDetailDTO detailDTO = createProjectDetail(1, "测试项目");
        when(projectService.getProjectDetail(1)).thenReturn(detailDTO);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("测试项目"));
    }

    @Test
    @DisplayName("获取项目详情 - 不存在")
    void getProject_NotFound() throws Exception {
        // Arrange
        when(projectService.getProjectDetail(999)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("项目不存在"));
    }

    // ==================== 创建项目测试 ====================

    @Test
    @DisplayName("创建项目 - 成功")
    void createProject_Success() throws Exception {
        // Arrange
        Project project = createProject(1, "新项目", 1);
        when(projectService.save(any(Project.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.name").value("新项目"));
    }

    @Test
    @DisplayName("创建项目 - 失败：项目名称为空")
    void createProject_Failure_EmptyName() throws Exception {
        // Arrange
        Project project = createProject(null, "", 1);

        // Act & Assert
        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk());
    }

    // ==================== 更新项目测试 ====================

    @Test
    @DisplayName("更新项目 - 成功")
    void updateProject_Success() throws Exception {
        // Arrange
        Project project = createProject(1, "更新后的项目", 1);
        when(projectService.updateById(any(Project.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(put("/api/admin/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.name").value("更新后的项目"));
    }

    @Test
    @DisplayName("更新项目 - 项目不存在")
    void updateProject_NotFound() throws Exception {
        // Arrange
        Project project = createProject(999, "不存在的项目", 1);
        when(projectService.updateById(any(Project.class))).thenReturn(false);

        // Act & Assert
        mockMvc.perform(put("/api/admin/projects/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isOk());
    }

    // ==================== 删除项目测试 ====================

    @Test
    @DisplayName("删除项目 - 成功")
    void deleteProject_Success() throws Exception {
        // Arrange
        when(projectService.removeById(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("success"));
    }

    @Test
    @DisplayName("删除项目 - 项目不存在")
    void deleteProject_NotFound() throws Exception {
        // Arrange
        when(projectService.removeById(999)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/projects/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    // ==================== 分类下项目查询测试 ====================

    @Test
    @DisplayName("获取分类下的项目 - 成功")
    void getProjectsByCategory_Success() throws Exception {
        // Arrange
        java.util.List<Project> projects = Arrays.asList(
                createProject(1, "项目1", 1),
                createProject(2, "项目2", 1)
        );
        when(projectService.getProjectsByCategory(1)).thenReturn(projects);

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", org.hamcrest.Matchers.hasSize(2)));
    }

    @Test
    @DisplayName("获取分类下的项目 - 空结果")
    void getProjectsByCategory_EmptyResult() throws Exception {
        // Arrange
        when(projectService.getProjectsByCategory(1)).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/admin/projects/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", org.hamcrest.Matchers.hasSize(0)));
    }

    // ==================== 辅助方法 ====================

    private Project createProject(Integer id, String name, Integer categoryId) {
        Project project = new Project();
        project.setId(id);
        project.setName(name);
        project.setCategoryId(categoryId);
        project.setLocation("北京");
        project.setYear("2024");
        project.setDescription("项目描述");
        project.setStatus((byte) 1);
        project.setSortOrder(0);
        project.setViewCount(0);
        return project;
    }

    private ProjectDetailDTO createProjectDetail(Integer id, String name) {
        ProjectDetailDTO dto = new ProjectDetailDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setCategoryId(1);
        dto.setCategoryName("住宅空间");
        dto.setLocation("北京");
        dto.setYear("2024");
        dto.setDescription("项目描述");
        dto.setViewCount(100);
        return dto;
    }
}