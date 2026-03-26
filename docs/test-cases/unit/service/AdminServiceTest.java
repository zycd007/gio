package com.gio.service;

import cn.hutool.crypto.digest.BCrypt;
import com.gio.dto.LoginRequest;
import com.gio.dto.LoginResponse;
import com.gio.entity.AdminUser;
import com.gio.mapper.AdminUserMapper;
import com.gio.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 管理员服务单元测试
 *
 * 测试覆盖：
 * - 登录功能（成功/失败场景）
 * - JWT Token 生成与验证
 * - 用户查询
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AdminService 单元测试")
class AdminServiceTest {

    @Mock
    private AdminUserMapper adminUserMapper;

    @InjectMocks
    private AdminServiceImpl adminService;

    private static final String TEST_JWT_SECRET = "test-jwt-secret-key-for-testing-only-32ch";
    private static final Long TEST_JWT_EXPIRATION = 86400000L;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(adminService, "jwtSecret", TEST_JWT_SECRET);
        ReflectionTestUtils.setField(adminService, "jwtExpiration", TEST_JWT_EXPIRATION);
    }

    // ==================== 登录功能测试 ====================

    @Test
    @DisplayName("登录 - 成功场景：正确的用户名和密码")
    void login_Success_WithCorrectCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        AdminUser mockUser = createAdminUser(1L, "admin", "管理员", (byte) 1);
        mockUser.setPassword(BCrypt.hashpw("admin123"));

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        // Act
        LoginResponse response = adminService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isNotBlank();
        assertThat(response.getUsername()).isEqualTo("admin");
        assertThat(response.getNickname()).isEqualTo("管理员");
    }

    @Test
    @DisplayName("登录 - 失败场景：用户不存在")
    void login_Failure_WhenUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password123");

        when(adminUserMapper.selectOne(any())).thenReturn(null);

        // Act & Assert
        assertThatThrownBy(() -> adminService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("用户名或密码错误");
    }

    @Test
    @DisplayName("登录 - 失败场景：密码错误")
    void login_Failure_WithWrongPassword() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("wrongpassword");

        AdminUser mockUser = createAdminUser(1L, "admin", "管理员", (byte) 1);
        mockUser.setPassword(BCrypt.hashpw("admin123"));

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        // Act & Assert
        assertThatThrownBy(() -> adminService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("用户名或密码错误");
    }

    @Test
    @DisplayName("登录 - 失败场景：账号被禁用")
    void login_Failure_WhenAccountDisabled() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        AdminUser mockUser = createAdminUser(1L, "admin", "管理员", (byte) 0); // 禁用状态
        mockUser.setPassword(BCrypt.hashpw("admin123"));

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        // Act & Assert
        assertThatThrownBy(() -> adminService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("账号已被禁用");
    }

    // ==================== Token 验证测试 ====================

    @Test
    @DisplayName("Token 验证 - 成功验证有效 Token")
    void verifyToken_Success_WithValidToken() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        AdminUser mockUser = createAdminUser(1L, "admin", "管理员", (byte) 1);
        mockUser.setPassword(BCrypt.hashpw("admin123"));

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        LoginResponse loginResponse = adminService.login(request);

        // Act
        boolean isValid = adminService.verifyToken(loginResponse.getToken());

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Token 验证 - 失败：无效 Token")
    void verifyToken_Failure_WithInvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act
        boolean isValid = adminService.verifyToken(invalidToken);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Token 解析 - 成功获取用户名")
    void getUsernameFromToken_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        AdminUser mockUser = createAdminUser(1L, "admin", "管理员", (byte) 1);
        mockUser.setPassword(BCrypt.hashpw("admin123"));

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        LoginResponse loginResponse = adminService.login(request);

        // Act
        String username = adminService.getUsernameFromToken(loginResponse.getToken());

        // Assert
        assertThat(username).isEqualTo("admin");
    }

    @Test
    @DisplayName("Token 解析 - 失败：无效 Token 返回 null")
    void getUsernameFromToken_Failure_WithInvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act
        String username = adminService.getUsernameFromToken(invalidToken);

        // Assert
        assertThat(username).isNull();
    }

    // ==================== 用户查询测试 ====================

    @Test
    @DisplayName("根据用户名查询 - 成功")
    void getByUsername_Success() {
        // Arrange
        String username = "admin";
        AdminUser mockUser = createAdminUser(1L, username, "管理员", (byte) 1);

        when(adminUserMapper.selectOne(any())).thenReturn(mockUser);

        // Act
        AdminUser result = adminService.getByUsername(username);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(username);
        assertThat(result.getNickname()).isEqualTo("管理员");
    }

    @Test
    @DisplayName("根据用户名查询 - 用户不存在")
    void getByUsername_ReturnNull_WhenNotFound() {
        // Arrange
        String username = "nonexistent";
        when(adminUserMapper.selectOne(any())).thenReturn(null);

        // Act
        AdminUser result = adminService.getByUsername(username);

        // Assert
        assertThat(result).isNull();
    }

    // ==================== 辅助方法 ====================

    private AdminUser createAdminUser(Long id, String username, String nickname, Byte status) {
        AdminUser user = new AdminUser();
        user.setId(id);
        user.setUsername(username);
        user.setNickname(nickname);
        user.setStatus(status);
        user.setPassword("$2a$10$dummyhashedpassword");
        user.setRole("admin");
        return user;
    }
}