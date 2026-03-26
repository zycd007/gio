package com.gio.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.gio.dto.DashboardStatsDTO;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.entity.ProjectImage;
import com.gio.mapper.CategoryMapper;
import com.gio.service.CategoryService;
import com.gio.service.ProjectService;
import com.gio.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * 分类服务单元测试
 *
 * 测试覆盖：
 * - 获取启用的分类列表
 * - 获取所有分类
 * - Dashboard 统计数据
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryService 单元测试")
class CategoryServiceTest {

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    // ==================== 获取分类列表测试 ====================

    @Test
    @DisplayName("获取启用的分类列表 - 成功")
    void getEnabledCategories_Success() {
        // Arrange
        List<Category> categories = Arrays.asList(
                createCategory(1, "住宅空间", "residential"),
                createCategory(2, "办公空间", "office"),
                createCategory(3, "餐饮空间", "restaurant")
        );
        when(categoryMapper.selectList(any(QueryWrapper.class))).thenReturn(categories);

        // Act
        List<Category> result = categoryService.getEnabledCategories();

        // Assert
        assertThat(result).hasSize(3);
        assertThat(result).extracting(Category::getStatus).containsOnly((byte) 1);
    }

    @Test
    @DisplayName("获取启用的分类列表 - 空结果")
    void getEnabledCategories_ReturnEmptyList() {
        // Arrange
        when(categoryMapper.selectList(any(QueryWrapper.class))).thenReturn(Collections.emptyList());

        // Act
        List<Category> result = categoryService.getEnabledCategories();

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("获取所有分类 - 成功")
    void getAllCategories_Success() {
        // Arrange
        List<Category> categories = Arrays.asList(
                createCategory(1, "住宅空间", "residential"),
                createCategory(2, "办公空间", "office"),
                createCategory(3, "餐饮空间", "restaurant")
        );
        when(categoryMapper.selectList(any(QueryWrapper.class))).thenReturn(categories);

        // Act
        List<Category> result = categoryService.getAllCategories();

        // Assert
        assertThat(result).hasSize(3);
    }

    // ==================== Dashboard 统计测试 ====================

    @Test
    @DisplayName("Dashboard 统计 - 成功获取所有统计数据")
    void getDashboardStats_Success() {
        // Arrange
        when(categoryMapper.selectCount(any(QueryWrapper.class))).thenReturn(10L);
        when(projectService.getBaseMapper()).thenReturn(projectMapper());

        // 创建模拟的 ProjectMapper
        when(projectService.getBaseMapper().selectCount(any(QueryWrapper.class))).thenReturn(15L);

        // Act
        DashboardStatsDTO result = categoryService.getDashboardStats();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTotalCategories()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Dashboard 统计 - 验证查询调用")
    void getDashboardStats_VerifyQueryCalls() {
        // Arrange
        when(categoryMapper.selectCount(any(QueryWrapper.class))).thenReturn(5L);

        // 模拟返回 Long 值
        when(projectService.getBaseMapper()).thenReturn(projectMapper());
        when(projectMapper().selectCount(any(QueryWrapper.class))).thenReturn(20L);

        // Act
        categoryService.getDashboardStats();

        // Assert - 验证被调用次数
        verify(categoryMapper, times(3)).selectCount(any(QueryWrapper.class));
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
        category.setSortOrder(id);
        return category;
    }

    private ProjectMapper projectMapper() {
        // 返回一个模拟的 ProjectMapper
        return mock(ProjectMapper.class);
    }

    private static class ProjectMapper extends com.baomidou.mybatisplus.core.mapper.BaseMapper<Project> {
        @Override
        public Long selectCount(QueryWrapper<Object> queryWrapper) {
            return 20L;
        }
    }
}