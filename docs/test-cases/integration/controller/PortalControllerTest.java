package com.gio.controller;

import com.gio.entity.Category;
import com.gio.service.CategoryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * C端门户 Controller 集成测试
 *
 * 测试覆盖：
 * - GET /api/categories - 获取分类列表
 * - GET /api/projects - 获取项目列表
 * - GET /api/projects/{id} - 获取项目详情
 */
@WebMvcTest(PortalController.class)
@DisplayName("PortalController 集成测试")
class PortalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private com.gio.service.ProjectService projectService;

    // ==================== 分类接口测试 ====================

    @Test
    @DisplayName("获取分类列表 - 成功返回启用的分类")
    void getCategories_ReturnsEnabledCategories() throws Exception {
        // Arrange
        List<Category> categories = Arrays.asList(
                createCategory(1, "住宅空间", "residential"),
                createCategory(2, "办公空间", "office")
        );
        when(categoryService.getEnabledCategories()).thenReturn(categories);

        // Act & Assert
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].name").value("住宅空间"))
                .andExpect(jsonPath("$.data[0].code").value("residential"));
    }

    @Test
    @DisplayName("获取分类列表 - 空结果")
    void getCategories_ReturnsEmptyList() throws Exception {
        // Arrange
        when(categoryService.getEnabledCategories()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    // ==================== 项目列表接口测试 ====================

    @Test
    @DisplayName("获取项目列表 - 默认分页")
    void getProjects_DefaultPagination() throws Exception {
        // Arrange
        com.gio.dto.PageResult<com.gio.dto.ProjectListItemDTO> pageResult =
                new com.gio.dto.PageResult<>(Collections.emptyList(), 0, 1, 10);
        when(projectService.getProjectList(any(), any(), any())).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.page").value(1))
                .andExpect(jsonPath("$.data.size").value(10));
    }

    @Test
    @DisplayName("获取项目列表 - 自定义分页参数")
    void getProjects_CustomPagination() throws Exception {
        // Arrange
        com.gio.dto.PageResult<com.gio.dto.ProjectListItemDTO> pageResult =
                new com.gio.dto.PageResult<>(Collections.emptyList(), 20, 2, 5);
        when(projectService.getProjectList(2, 5, null)).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/projects")
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
        com.gio.dto.PageResult<com.gio.dto.ProjectListItemDTO> pageResult =
                new com.gio.dto.PageResult<>(Collections.emptyList(), 5, 1, 10);
        when(projectService.getProjectList(1, 10, 1)).thenReturn(pageResult);

        // Act & Assert
        mockMvc.perform(get("/api/projects")
                        .param("categoryId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    // ==================== 项目详情接口测试 ====================

    @Test
    @DisplayName("获取项目详情 - 成功")
    void getProjectDetail_Success() throws Exception {
        // Arrange
        com.gio.dto.ProjectDetailDTO detailDTO = createProjectDetail(1, "测试项目");
        when(projectService.getProjectDetail(1)).thenReturn(detailDTO);

        // Act & Assert
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("测试项目"));
    }

    @Test
    @DisplayName("获取项目详情 - 项目不存在")
    void getProjectDetail_NotFound() throws Exception {
        // Arrange
        when(projectService.getProjectDetail(999)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/projects/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("项目不存在"));
    }

    // ==================== 辅助方法 ====================

    private Category createCategory(Integer id, String name, String code) {
        Category category = new Category();
        category.setId(id);
        category.setName(name);
        category.setNameEn(name + " English");
        category.setCode(code);
        category.setStatus((byte) 1);
        category.setSortOrder(id);
        return category;
    }

    private com.gio.dto.ProjectDetailDTO createProjectDetail(Integer id, String name) {
        com.gio.dto.ProjectDetailDTO dto = new com.gio.dto.ProjectDetailDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setCategoryId(1);
        dto.setCategoryName("住宅空间");
        dto.setLocation("北京");
        dto.setYear("2024");
        dto.setViewCount(100);
        return dto;
    }
}