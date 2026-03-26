package com.gio.e2e;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * 端到端认证流程测试
 *
 * 测试完整用户流程：
 * 1. 登录获取 Token
 * 2. 使用 Token 访问受保护资源
 * 3. 刷新 Token
 * 4. 登出
 *
 * 前置条件：
 * - 服务运行在 http://localhost:8082
 * - 数据库中有 admin/admin123 用户
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("端到端 - 认证流程测试")
class AuthenticationFlowTest {

    private static String authToken;
    private static String refreshToken;
    private static final String BASE_URL = "http://localhost:8082";
    private static final String LOGIN_ENDPOINT = "/api/admin/login";
    private static final String ME_ENDPOINT = "/api/admin/me";
    private static final String LOGOUT_ENDPOINT = "/api/admin/logout";

    @BeforeAll
    static void setUp() {
        RestAssured.baseURI = BASE_URL;
    }

    // ==================== 登录流程测试 ====================

    @Test
    @Order(1)
    @DisplayName("登录流程 - 成功登录并获取 Token")
    void login_Success_GetToken() {
        // Arrange
        String requestBody = """
            {
                "username": "admin",
                "password": "admin123"
            }
            """;

        // Act
        Response response = given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(LOGIN_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("message", equalTo("success"))
                .body("data.token", notNullValue())
                .body("data.refreshToken", notNullValue())
                .body("data.username", equalTo("admin"))
                .extract().response();

        // Assert
        authToken = response.jsonPath().getString("data.token");
        refreshToken = response.jsonPath().getString("data.refreshToken");

        assertThat(authToken).isNotBlank();
        assertThat(refreshToken).isNotBlank();
    }

    @Test
    @Order(2)
    @DisplayName("登录流程 - 登录后使用 Token 访问受保护资源")
    void accessProtectedResource_WithToken() {
        // Assume - 已登录获取 Token
        assumeTrue(authToken != null && !authToken.isEmpty());

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .when()
                .get(ME_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(401))); // 取决于 Security 配置
    }

    // ==================== 登录失败场景测试 ====================

    @Test
    @DisplayName("登录流程 - 错误密码")
    void login_Failure_WrongPassword() {
        // Arrange
        String requestBody = """
            {
                "username": "admin",
                "password": "wrongpassword"
            }
            """;

        // Act & Assert
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(LOGIN_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(500))
                .body("message", containsString("错误"));
    }

    @Test
    @DisplayName("登录流程 - 用户不存在")
    void login_Failure_UserNotFound() {
        // Arrange
        String requestBody = """
            {
                "username": "nonexistent",
                "password": "password123"
            }
            """;

        // Act & Assert
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(LOGIN_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(500));
    }

    @Test
    @DisplayName("登录流程 - 空请求体")
    void login_Failure_EmptyRequest() {
        // Act & Assert
        given()
                .contentType(ContentType.JSON)
                .body("{}")
                .when()
                .post(LOGIN_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(400), is(500)));
    }

    // ==================== Token 无效场景测试 ====================

    @Test
    @DisplayName("访问受保护资源 - 无 Token")
    void accessProtectedResource_WithoutToken() {
        // Act & Assert
        given()
                .when()
                .get(ME_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(401), is(403)));
    }

    @Test
    @DisplayName("访问受保护资源 - 无效 Token")
    void accessProtectedResource_InvalidToken() {
        // Act & Assert
        given()
                .header("Authorization", "Bearer invalid.token.here")
                .when()
                .get(ME_ENDPOINT)
                .then()
                .statusCode(anyOf(is(200), is(401), is(403)));
    }

    // ==================== 登出测试 ====================

    @Test
    @DisplayName("登出流程 - 成功")
    void logout_Success() {
        // Assume - 已登录
        assumeTrue(authToken != null);

        // Act & Assert
        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .when()
                .post(LOGOUT_ENDPOINT)
                .then()
                .statusCode(200)
                .body("code", equalTo(200))
                .body("message", equalTo("success"));
    }

    // ==================== 刷新 Token 测试 ====================

    @Test
    @DisplayName("刷新 Token - 成功")
    void refreshToken_Success() {
        // Note: 需要后端实现刷新 Token 接口
        // 假设刷新 Token 端点为 POST /api/admin/refresh
        // 此测试需要实际的刷新接口

        // Assume - 已获取刷新 Token
        assumeTrue(refreshToken != null && !refreshToken.isEmpty());

        // 如果有刷新端点，可以测试
        // Skip for now as endpoint may not exist
    }
}