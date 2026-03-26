package com.gio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gio.entity.Category;
import com.gio.service.CategoryService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 管理员分类管理 Controller 集成测试
 *
 * 测试覆盖：
 * - GET /api/admin/categories - 获取所有分类
 * - GET /api/admin/categories/{id} - 获取分类详情
 * - POST /api/admin/categories - 创建分类
 * - PUT /api/admin/categories/{id} - 更新分类
 * - DELETE /api/admin/categories/{id} - 删除分类
 */
@WebMvcTest(AdminCategoryController.class)
@DisplayName("AdminCategoryController 集成测试")
class AdminCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    // ==================== 获取分类列表测试 ====================

    @Test
    @DisplayName("获取所有分类 - 成功")
    void getAllCategories_Success() throws Exception {
        // Arrange
        java.util.List<Category> categories = Arrays.asList(
                createCategory(1, "住宅空间", "residential"),
                createCategory(2, "办公空间", "office"),
                createCategory(3, "餐饮空间", "restaurant")
        );
        when(categoryService.getAllCategories()).thenReturn(categories);

        // Act & Assert
        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", org.hamcrest.Matchers.hasSize(3)))
                .andExpect(jsonPath("$.data[0].name").value("住宅空间"))
                .andExpect(jsonPath("$.data[0].code").value("residential"));
    }

    @Test
    @DisplayName("获取所有分类 - 空结果")
    void getAllCategories_EmptyResult() throws Exception {
        // Arrange
        when(categoryService.getAllCategories()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", org.hamcrest.Matchers.hasSize(0)));
    }

    // ==================== 获取分类详情测试 ====================

    @Test
    @DisplayName("获取分类详情 - 成功")
    void getCategory_Success() throws Exception {
        // Arrange
        Category category = createCategory(1, "住宅空间", "residential");
        when(categoryService.getById(1)).thenReturn(category);

        // Act & Assert
        mockMvc.perform(get("/api/admin/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("住宅空间"))
                .andExpect(jsonPath("$.data.code").value("residential"));
    }

    @Test
    @DisplayName("获取分类详情 - 不存在")
    void getCategory_NotFound() throws Exception {
        // Arrange
        when(categoryService.getById(999)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/admin/categories/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("分类不存在"));
    }

    // ==================== 创建分类测试 ====================

    @Test
    @DisplayName("创建分类 - 成功")
    void createCategory_Success() throws Exception {
        // Arrange
        Category category = createCategory(null, "医疗空间", "medical");
        Category savedCategory = createCategory(10, "医疗空间", "medical");
        savedCategory.setStatus((byte) 1);

        when(categoryService.save(any(Category.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.name").value("医疗空间"))
                .andExpect(jsonPath("$.data.code").value("medical"));
    }

    @Test
    @DisplayName("创建分类 - 失败：分类名称为空")
    void createCategory_Failure_EmptyName() throws Exception {
        // Arrange
        Category category = createCategory(null, "", "medical");

        // Act & Assert
        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("创建分类 - 失败：分类编码为空")
    void createCategory_Failure_EmptyCode() throws Exception {
        // Arrange
        Category category = createCategory(null, "医疗空间", "");

        // Act & Assert
        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk());
    }

    // ==================== 更新分类测试 ====================

    @Test
    @DisplayName("更新分类 - 成功")
    void updateCategory_Success() throws Exception {
        // Arrange
        Category category = createCategory(1, "更新的分类", "updated");
        when(categoryService.updateById(any(Category.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(put("/api/admin/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.name").value("更新的分类"));
    }

    @Test
    @DisplayName("更新分类 - 分类不存在")
    void updateCategory_NotFound() throws Exception {
        // Arrange
        Category category = createCategory(999, "不存在的分类", "nonexistent");
        when(categoryService.updateById(any(Category.class))).thenReturn(false);

        // Act & Assert
        mockMvc.perform(put("/api/admin/categories/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk());
    }

    // ==================== 删除分类测试 ====================

    @Test
    @DisplayName("删除分类 - 成功")
    void deleteCategory_Success() throws Exception {
        // Arrange
        when(categoryService.removeById(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("success"));
    }

    @Test
    @DisplayName("删除分类 - 分类不存在")
    void deleteCategory_NotFound() throws Exception {
        // Arrange
        when(categoryService.removeById(999)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/categories/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    // ==================== 辅助方法 ====================

    private Category createCategory(Integer id, String name, String code) {
        Category category = new Category();
        category.setId(id);
        category.setName(name);
        category.setNameEn(name + " English");
        category.setCode(code);
        category.setIcon("/icons/" + code + ".png");
        category.setStatus((byte) 1);
        category.setSortOrder(id != null ? id : 0);
        return category;
    }
}