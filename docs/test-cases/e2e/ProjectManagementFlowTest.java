package com.gio.e2e;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * 端到端项目管理流程测试
 *
 * 测试完整项目管理流程：
 * 1. 登录获取 Token
 * 2. 创建项目
 * 3. 获取项目列表
 * 4. 获取项目详情
 * 5. 更新项目
 * 6. 上传项目图片
 * 7. 删除项目
 *
 * 前置条件：
 * - 服务运行在 http://localhost:8082
 * - 已存在分类数据
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("端到端 - 项目管理流程测试")
class ProjectManagementFlowTest {

    private static String authToken;
    private static Integer createdProjectId;
    private static final String BASE_URL = "http://localhost:8082";
    private static final String LOGIN_ENDPOINT = "/api/admin/login";
    private static final String PROJECTS_ENDPOINT = "/api/admin/projects";

    @BeforeAll
    static void setUp() {
        RestAssured.baseURI = BASE_URL;
        // 先登录获取 Token
        login();
    }

    private static void login() {
        String requestBody = """
            {
                "username": "admin",
                "password": "admin123"
            }
            """;

        authToken = given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(LOGIN_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .extract()
                .jsonPath()
                .getString("data.token");
    }

    // ==================== 创建项目测试 ====================

    @Test
    @Order(1)
    @DisplayName("项目管理 - 创建项目")
    void createProject_Success() {
        // Arrange
        String requestBody = """
            {
                "name": "测试项目-E2E",
                "categoryId": 1,
                "location": "北京朝阳区",
                "year": "2024",
                "description": "这是一个端到端测试创建的项目",
                "sortOrder": 0,
                "status": 0
            }
            """;

        // Act
        Response response = given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(PROJECTS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.name", equalTo("测试项目-E2E"))
                .body("data.categoryId", equalTo(1))
                .body("data.status", equalTo(0))
                .extract().response();

        // Assert
        createdProjectId = response.jsonPath().getInt("data.id");
        assertThat(createdProjectId).isNotNull();
    }

    // ==================== 获取项目列表测试 ====================

    @Test
    @Order(2)
    @DisplayName("项目管理 - 获取项目列表")
    void getProjectList_Success() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .param("page", 1)
                .param("size", 10)
                .when()
                .get(PROJECTS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.list", is(notNullValue()))
                .body("data.page", equalTo(1))
                .body("data.size", equalTo(10));
    }

    @Test
    @Order(3)
    @DisplayName("项目管理 - 按分类筛选项目")
    void getProjectList_WithCategoryFilter() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .param("categoryId", 1)
                .when()
                .get(PROJECTS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200));
    }

    // ==================== 获取项目详情测试 ====================

    @Test
    @Order(4)
    @DisplayName("项目管理 - 获取项目详情")
    void getProjectDetail_Success() {
        // Assume - 项目已创建
        assumeTrue(createdProjectId != null);

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(PROJECTS_ENDPOINT + "/" + createdProjectId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.id", equalTo(createdProjectId))
                .body("data.name", equalTo("测试项目-E2E"));
    }

    @Test
    @DisplayName("项目管理 - 获取不存在的项目详情")
    void getProjectDetail_NotFound() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(PROJECTS_ENDPOINT + "/999999")
                .then()
                .statusCode(200)
                .body("code", equalTo(404))
                .body("message", equalTo("项目不存在"));
    }

    // ==================== 更新项目测试 ====================

    @Test
    @Order(5)
    @DisplayName("项目管理 - 更新项目")
    void updateProject_Success() {
        // Assume - 项目已创建
        assumeTrue(createdProjectId != null);

        // Arrange
        String requestBody = """
            {
                "name": "测试项目-E2E-已更新",
                "categoryId": 2,
                "location": "上海浦东新区",
                "year": "2025",
                "description": "更新后的描述",
                "status": 1
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .put(PROJECTS_ENDPOINT + "/" + createdProjectId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.name", equalTo("测试项目-E2E-已更新"))
                .body("data.status", equalTo(1));
    }

    // ==================== 发布/下架项目测试 ====================

    @Test
    @Order(6)
    @DisplayName("项目管理 - 发布项目")
    void publishProject_Success() {
        // Assume - 项目已创建
        assumeTrue(createdProjectId != null);

        // Arrange - 设置为已发布状态
        String requestBody = """
            {
                "status": 1
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .put(PROJECTS_ENDPOINT + "/" + createdProjectId)
                .then()
                .statusCode(200)
                .body("data.status", equalTo(1));
    }

    // ==================== 分类下项目查询测试 ====================

    @Test
    @DisplayName("项目管理 - 获取分类下的项目")
    void getProjectsByCategory_Success() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(PROJECTS_ENDPOINT + "/category/1")
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data", is(notNullValue()));
    }

    // ==================== 删除项目测试 ====================

    @Test
    @Order(7)
    @DisplayName("项目管理 - 删除项目")
    void deleteProject_Success() {
        // Assume - 项目已创建
        assumeTrue(createdProjectId != null);

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .delete(PROJECTS_ENDPOINT + "/" + createdProjectId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("message", equalTo("success"));
    }

    @Test
    @DisplayName("项目管理 - 删除不存在的项目")
    void deleteProject_NotFound() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .delete(PROJECTS_ENDPOINT + "/999999")
                .then()
                .statusCode(200);
    }

    // ==================== 未授权访问测试 ====================

    @Test
    @DisplayName("项目管理 - 未授权访问项目列表")
    void getProjectList_WithoutAuth() {
        // Act & Assert
        given()
                .when()
                .get(PROJECTS_ENDPOINT)
                .then()
                .statusCode(anyOf(is(401), is(403)));
    }

    @Test
    @DisplayName("项目管理 - 未授权创建项目")
    void createProject_WithoutAuth() {
        // Arrange
        String requestBody = """
            {
                "name": "未授权项目"
            }
            """;

        // Act & Assert
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(PROJECTS_ENDPOINT)
                .then()
                .statusCode(anyOf(is(401), is(403)));
    }
}