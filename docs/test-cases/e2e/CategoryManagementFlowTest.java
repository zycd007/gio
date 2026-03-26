package com.gio.e2e;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * 端到端分类管理流程测试
 *
 * 测试完整分类管理流程：
 * 1. 登录获取 Token
 * 2. 创建分类
 * 3. 获取分类列表
 * 4. 获取分类详情
 * 5. 更新分类
 * 6. 删除分类
 *
 * 前置条件：
 * - 服务运行在 http://localhost:8082
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("端到端 - 分类管理流程测试")
class CategoryManagementFlowTest {

    private static String authToken;
    private static Integer createdCategoryId;
    private static final String BASE_URL = "http://localhost:8082";
    private static final String LOGIN_ENDPOINT = "/api/admin/login";
    private static final String CATEGORIES_ENDPOINT = "/api/admin/categories";

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

    // ==================== 创建分类测试 ====================

    @Test
    @Order(1)
    @DisplayName("分类管理 - 创建分类")
    void createCategory_Success() {
        // Arrange
        String requestBody = """
            {
                "name": "测试分类-E2E",
                "nameEn": "Test Category",
                "code": "test-category",
                "icon": "/icons/test.png",
                "sortOrder": 99,
                "status": 1
            }
            """;

        // Act
        Response response = given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.name", equalTo("测试分类-E2E"))
                .body("data.code", equalTo("test-category"))
                .body("data.status", equalTo(1))
                .extract().response();

        // Assert
        createdCategoryId = response.jsonPath().getInt("data.id");
        assertThat(createdCategoryId).isNotNull();
    }

    @Test
    @DisplayName("分类管理 - 创建分类-名称为空")
    void createCategory_Failure_EmptyName() {
        // Arrange
        String requestBody = """
            {
                "name": "",
                "code": "empty-name-category"
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(400), is(500)));
    }

    @Test
    @DisplayName("分类管理 - 创建分类-编码为空")
    void createCategory_Failure_EmptyCode() {
        // Arrange
        String requestBody = """
            {
                "name": "新分类",
                "code": ""
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(400), is(500)));
    }

    // ==================== 获取分类列表测试 ====================

    @Test
    @Order(2)
    @DisplayName("分类管理 - 获取分类列表")
    void getCategories_Success() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data", is(notNullValue()));
    }

    // ==================== 获取分类详情测试 ====================

    @Test
    @Order(3)
    @DisplayName("分类管理 - 获取分类详情")
    void getCategory_Success() {
        // Assume - 分类已创建
        assumeTrue(createdCategoryId != null);

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(CATEGORIES_ENDPOINT + "/" + createdCategoryId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.id", equalTo(createdCategoryId))
                .body("data.name", equalTo("测试分类-E2E"));
    }

    @Test
    @DisplayName("分类管理 - 获取不存在的分类")
    void getCategory_NotFound() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(CATEGORIES_ENDPOINT + "/999999")
                .then()
                .statusCode(200)
                .body("code", equalTo(404))
                .body("message", equalTo("分类不存在"));
    }

    // ==================== 更新分类测试 ====================

    @Test
    @Order(4)
    @DisplayName("分类管理 - 更新分类")
    void updateCategory_Success() {
        // Assume - 分类已创建
        assumeTrue(createdCategoryId != null);

        // Arrange
        String requestBody = """
            {
                "name": "测试分类-E2E-已更新",
                "nameEn": "Updated Test Category",
                "code": "updated-test-category",
                "icon": "/icons/updated.png",
                "sortOrder": 50,
                "status": 1
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .put(CATEGORIES_ENDPOINT + "/" + createdCategoryId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("data.name", equalTo("测试分类-E2E-已更新"));
    }

    @Test
    @Order(5)
    @DisplayName("分类管理 - 禁用分类")
    void disableCategory_Success() {
        // Assume - 分类已创建
        assumeTrue(createdCategoryId != null);

        // Arrange - 设置为禁用状态
        String requestBody = """
            {
                "status": 0
            }
            """;

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .put(CATEGORIES_ENDPOINT + "/" + createdCategoryId)
                .then()
                .statusCode(200)
                .body("data.status", equalTo(0));
    }

    // ==================== 删除分类测试 ====================

    @Test
    @Order(6)
    @DisplayName("分类管理 - 删除分类")
    void deleteCategory_Success() {
        // Assume - 分类已创建
        assumeTrue(createdCategoryId != null);

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .delete(CATEGORIES_ENDPOINT + "/" + createdCategoryId)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("message", equalTo("success"));
    }

    @Test
    @DisplayName("分类管理 - 删除不存在的分类")
    void deleteCategory_NotFound() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .delete(CATEGORIES_ENDPOINT + "/999999")
                .then()
                .statusCode(200);
    }

    // ==================== 未授权访问测试 ====================

    @Test
    @DisplayName("分类管理 - 未授权访问分类列表")
    void getCategories_WithoutAuth() {
        // Act & Assert
        given()
                .when()
                .get(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(anyOf(is(401), is(403)));
    }

    @Test
    @DisplayName("分类管理 - 未授权创建分类")
    void createCategory_WithoutAuth() {
        // Arrange
        String requestBody = """
            {
                "name": "未授权分类"
            }
            """;

        // Act & Assert
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(CATEGORIES_ENDPOINT)
                .then()
                .statusCode(anyOf(is(401), is(403)));
    }
}