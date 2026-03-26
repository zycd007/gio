package com.gio.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 统一返回结果 Result 单元测试
 */
@DisplayName("Result 统一返回结果测试")
class ResultTest {

    @Test
    @DisplayName("成功响应 - 不带数据")
    void success_WithoutData() {
        // Act
        Result<Void> result = Result.success();

        // Assert
        assertThat(result.getCode()).isEqualTo(200);
        assertThat(result.getMessage()).isEqualTo("success");
        assertThat(result.getData()).isNull();
    }

    @Test
    @DisplayName("成功响应 - 带数据")
    void success_WithData() {
        // Arrange
        String data = "test data";

        // Act
        Result<String> result = Result.success(data);

        // Assert
        assertThat(result.getCode()).isEqualTo(200);
        assertThat(result.getMessage()).isEqualTo("success");
        assertThat(result.getData()).isEqualTo(data);
    }

    @Test
    @DisplayName("错误响应 - 默认错误码和消息")
    void error_Default() {
        // Act
        Result<Void> result = Result.error();

        // Assert
        assertThat(result.getCode()).isEqualTo(500);
        assertThat(result.getMessage()).isEqualTo("error");
    }

    @Test
    @DisplayName("错误响应 - 自定义错误码和消息")
    void error_WithCustomMessage() {
        // Arrange
        int code = 404;
        String message = "Resource not found";

        // Act
        Result<Void> result = Result.error(code, message);

        // Assert
        assertThat(result.getCode()).isEqualTo(code);
        assertThat(result.getMessage()).isEqualTo(message);
    }

    @Test
    @DisplayName("未授权响应")
    void unauthorized() {
        // Act
        Result<Void> result = Result.unauthorized();

        // Assert
        assertThat(result.getCode()).isEqualTo(401);
        assertThat(result.getMessage()).isEqualTo("Unauthorized");
    }

    @Test
    @DisplayName("未授权响应 - 自定义消息")
    void unauthorized_WithCustomMessage() {
        // Arrange
        String message = "Please login first";

        // Act
        Result<Void> result = Result.unauthorized(message);

        // Assert
        assertThat(result.getCode()).isEqualTo(401);
        assertThat(result.getMessage()).isEqualTo(message);
    }
}