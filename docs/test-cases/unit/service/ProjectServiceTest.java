package com.gio.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gio.dto.PageResult;
import com.gio.dto.ProjectDetailDTO;
import com.gio.dto.ProjectListItemDTO;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.entity.ProjectImage;
import com.gio.mapper.ProjectMapper;
import com.gio.service.CategoryService;
import com.gio.service.ImageService;
import com.gio.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * 项目服务单元测试
 *
 * 测试覆盖：
 * - 获取项目列表（分页、筛选）
 * - 获取项目详情
 * - 浏览量递增
 * - 分类下项目查询
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectService 单元测试")
class ProjectServiceTest {

    @Mock
    private ProjectMapper projectMapper;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    // ==================== 获取项目列表测试 ====================

    @Test
    @DisplayName("获取项目列表 - 默认分页参数")
    void getProjectList_WithDefaultPagination() {
        // Arrange
        Page<Project> mockPage = createMockPage(1, 10, 20);
        when(projectMapper.selectPage(any(Page.class), any())).thenReturn(mockPage);

        // Act
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(1, 10, null);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPage()).isEqualTo(1);
        assertThat(result.getSize()).isEqualTo(10);
        assertThat(result.getTotal()).isEqualTo(20);
    }

    @Test
    @DisplayName("获取项目列表 - 自定义分页参数")
    void getProjectList_WithCustomPagination() {
        // Arrange
        Page<Project> mockPage = createMockPage(2, 5, 15);
        when(projectMapper.selectPage(any(Page.class), any())).thenReturn(mockPage);

        // Act
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(2, 5, null);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPage()).isEqualTo(2);
        assertThat(result.getSize()).isEqualTo(5);
        assertThat(result.getTotal()).isEqualTo(15);
    }

    @Test
    @DisplayName("获取项目列表 - 按分类筛选")
    void getProjectList_WithCategoryFilter() {
        // Arrange
        Integer categoryId = 1;
        Page<Project> mockPage = createMockPage(1, 10, 5);
        when(projectMapper.selectPage(any(Page.class), any())).thenReturn(mockPage);

        // Act
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(1, 10, categoryId);

        // Assert
        assertThat(result).isNotNull();
        verify(projectMapper).selectPage(any(Page.class), any());
    }

    @Test
    @DisplayName("获取项目列表 - 空结果")
    void getProjectList_ReturnEmptyList() {
        // Arrange
        Page<Project> emptyPage = new Page<>(1, 10);
        emptyPage.setTotal(0);
        emptyPage.setRecords(Collections.emptyList());
        when(projectMapper.selectPage(any(Page.class), any())).thenReturn(emptyPage);

        // Act
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(1, 10, null);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTotal()).isEqualTo(0);
        assertThat(result.getList()).isEmpty();
    }

    @Test
    @DisplayName("获取项目列表 - 空值参数处理")
    void getProjectList_HandleNullParameters() {
        // Arrange
        Page<Project> mockPage = createMockPage(1, 10, 10);
        when(projectMapper.selectPage(any(Page.class), any())).thenReturn(mockPage);

        // Act
        PageResult<ProjectListItemDTO> result = projectService.getProjectList(null, null, null);

        // Assert
        assertThat(result).isNotNull();
        // 验证默认值：page=1, size=10
        assertThat(result.getPage()).isEqualTo(1);
        assertThat(result.getSize()).isEqualTo(10);
    }

    // ==================== 获取项目详情测试 ====================

    @Test
    @DisplayName("获取项目详情 - 成功")
    void getProjectDetail_Success() {
        // Arrange
        Integer projectId = 1;
        Project project = createProject(projectId, "测试项目", 1);
        project.setViewCount(10);

        Category category = createCategory(1, "住宅空间", "residential");
        List<ProjectImage> images = Arrays.asList(
                createImage(1, projectId, "image1.jpg", (byte) 1),
                createImage(2, projectId, "image2.jpg", (byte) 0)
        );

        when(projectMapper.selectById(projectId)).thenReturn(project);
        when(categoryService.getById(1)).thenReturn(category);
        when(imageService.getImagesByProject(projectId)).thenReturn(images);

        // Act
        ProjectDetailDTO result = projectService.getProjectDetail(projectId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(projectId);
        assertThat(result.getName()).isEqualTo("测试项目");
        assertThat(result.getCategoryName()).isEqualTo("住宅空间");
        assertThat(result.getImages()).hasSize(2);
    }

    @Test
    @DisplayName("获取项目详情 - 项目不存在")
    void getProjectDetail_ReturnNull_WhenNotFound() {
        // Arrange
        Integer projectId = 999;
        when(projectMapper.selectById(projectId)).thenReturn(null);

        // Act
        ProjectDetailDTO result = projectService.getProjectDetail(projectId);

        // Assert
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("获取项目详情 - 验证浏览量递增")
    void getProjectDetail_IncrementsViewCount() {
        // Arrange
        Integer projectId = 1;
        Project project = createProject(projectId, "测试项目", 1);
        project.setViewCount(10);

        when(projectMapper.selectById(projectId)).thenReturn(project);
        when(categoryService.getById(any())).thenReturn(createCategory(1, "住宅空间", "residential"));
        when(imageService.getImagesByProject(anyInt())).thenReturn(Collections.emptyList());

        // Act
        projectService.getProjectDetail(projectId);

        // Assert
        verify(projectMapper).update(any(), any());
    }

    // ==================== 浏览量递增测试 ====================

    @Test
    @DisplayName("浏览量递增 - 成功")
    void incrementViewCount_Success() {
        // Arrange
        Integer projectId = 1;

        // Act
        projectService.incrementViewCount(projectId);

        // Assert
        verify(projectMapper).update(any(), any());
    }

    // ==================== 分类下项目查询测试 ====================

    @Test
    @DisplayName("获取分类下项目 - 成功")
    void getProjectsByCategory_Success() {
        // Arrange
        Integer categoryId = 1;
        List<Project> projects = Arrays.asList(
                createProject(1, "项目1", categoryId),
                createProject(2, "项目2", categoryId)
        );
        when(projectMapper.selectList(any())).thenReturn(projects);

        // Act
        List<Project> result = projectService.getProjectsByCategory(categoryId);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Project::getCategoryId).containsOnly(categoryId);
    }

    @Test
    @DisplayName("获取分类下项目 - 无参数（查询所有已发布）")
    void getProjectsByCategory_WithoutFilter() {
        // Arrange
        List<Project> projects = Arrays.asList(
                createProject(1, "项目1", 1),
                createProject(2, "项目2", 2)
        );
        when(projectMapper.selectList(any())).thenReturn(projects);

        // Act
        List<Project> result = projectService.getProjectsByCategory(null);

        // Assert
        assertThat(result).hasSize(2);
    }

    // ==================== 辅助方法 ====================

    private Page<Project> createMockPage(int page, int size, int total) {
        Page<Project> mockPage = new Page<>(page, size);
        mockPage.setTotal(total);
        mockPage.setRecords(Arrays.asList(
                createProject(1, "项目1", 1),
                createProject(2, "项目2", 1),
                createProject(3, "项目3", 2)
        ));
        return mockPage;
    }

    private Project createProject(Integer id, String name, Integer categoryId) {
        Project project = new Project();
        project.setId(id);
        project.setName(name);
        project.setCategoryId(categoryId);
        project.setLocation("测试位置");
        project.setYear("2024");
        project.setDescription("测试描述");
        project.setStatus((byte) 1);
        project.setSortOrder(0);
        project.setViewCount(0);
        return project;
    }

    private Category createCategory(Integer id, String name, String code) {
        Category category = new Category();
        category.setId(id);
        category.setName(name);
        category.setNameEn(name + " En");
        category.setCode(code);
        category.setStatus((byte) 1);
        category.setSortOrder(0);
        return category;
    }

    private ProjectImage createImage(Integer id, Integer projectId, String imageName, Byte isCover) {
        ProjectImage image = new ProjectImage();
        image.setId(id);
        image.setProjectId(projectId);
        image.setImageName(imageName);
        image.setImagePath("/uploads/" + imageName);
        image.setImageType("jpg");
        image.setFileSize(1024000L);
        image.setWidth(1920);
        image.setHeight(1080);
        image.setIsCover(isCover);
        image.setSortOrder(0);
        image.setStatus((byte) 1);
        return image;
    }
}