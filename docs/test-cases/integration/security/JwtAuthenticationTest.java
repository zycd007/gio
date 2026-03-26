package com.gio.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * JWT 认证安全测试
 *
 * 测试覆盖：
 * - Token 生成
 * - Token 验证
 * - Token 解析
 * - Token 过期处理
 * - 刷新 Token
 */
@DisplayName("JWT 认证安全测试")
class JwtAuthenticationTest {

    private static final String SECRET = "test-jwt-secret-key-for-testing-only-32chars";
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION = 86400000L; // 24小时

    // ==================== Token 生成测试 ====================

    @Test
    @DisplayName("生成 Token - 成功")
    void generateToken_Success() {
        // Arrange
        String username = "admin";

        // Act
        String token = generateToken(username);

        // Assert
        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3); // JWT 结构: header.payload.signature
    }

    @Test
    @DisplayName("生成 Token - 包含正确的用户名声明")
    void generateToken_ContainsCorrectSubject() {
        // Arrange
        String username = "testuser";

        // Act
        String token = generateToken(username);

        // Assert
        Claims claims = parseToken(token);
        assertThat(claims.getSubject()).isEqualTo(username);
    }

    @Test
    @DisplayName("生成 Token - 包含签发时间")
    void generateToken_ContainsIssuedAt() {
        // Act
        String token = generateToken("admin");

        // Assert
        Claims claims = parseToken(token);
        assertThat(claims.getIssuedAt()).isNotNull();
    }

    @Test
    @DisplayName("生成 Token - 包含过期时间")
    void generateToken_ContainsExpiration() {
        // Act
        String token = generateToken("admin");

        // Assert
        Claims claims = parseToken(token);
        assertThat(claims.getExpiration()).isNotNull();
    }

    // ==================== Token 解析测试 ====================

    @Test
    @DisplayName("解析 Token - 成功")
    void parseToken_Success() {
        // Arrange
        String username = "admin";
        String token = generateToken(username);

        // Act
        Claims claims = parseToken(token);

        // Assert
        assertThat(claims).isNotNull();
        assertThat(claims.getSubject()).isEqualTo(username);
    }

    @Test
    @DisplayName("解析 Token - 无效 Token")
    void parseToken_Failure_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act & Assert
        try {
            parseToken(invalidToken);
            assertThat(false).isTrue(); // Should not reach here
        } catch (Exception e) {
            assertThat(e).isInstanceOf(Exception.class);
        }
    }

    // ==================== Token 过期测试 ====================

    @Test
    @DisplayName("Token 过期 - 已过期")
    void tokenExpiration_Expired() {
        // Arrange
        String expiredToken = Jwts.builder()
                .subject("admin")
                .issuedAt(new Date(System.currentTimeMillis() - 1000))
                .expiration(new Date(System.currentTimeMillis() - 1000)) // 已过期
                .signWith(KEY)
                .compact();

        // Act
        boolean isExpired = isTokenExpired(expiredToken);

        // Assert
        assertThat(isExpired).isTrue();
    }

    @Test
    @DisplayName("Token 过期 - 未过期")
    void tokenExpiration_NotExpired() {
        // Arrange
        String validToken = generateToken("admin");

        // Act
        boolean isExpired = isTokenExpired(validToken);

        // Assert
        assertThat(isExpired).isFalse();
    }

    // ==================== 刷新 Token 测试 ====================

    @Test
    @DisplayName("刷新 Token - 生成更长的过期时间")
    void refreshToken_GenerateLongerExpiration() {
        // Arrange
        String username = "admin";

        // Act
        String refreshToken = generateRefreshToken(username);
        Claims claims = parseToken(refreshToken);

        // Assert
        long expirationTime = claims.getExpiration().getTime();
        long issuedAtTime = claims.getIssuedAt().getTime();
        long tokenLifetime = expirationTime - issuedAtTime;

        // 刷新 Token 应该是主 Token 的 7 倍
        assertThat(tokenLifetime).isGreaterThan(EXPIRATION * 6);
        assertThat(tokenLifetime).isLessThanOrEqualTo(EXPIRATION * 7);
    }

    @Test
    @DisplayName("刷新 Token - 包含类型声明")
    void refreshToken_ContainsTypeClaim() {
        // Arrange
        String refreshToken = generateRefreshToken("admin");

        // Act
        Claims claims = parseToken(refreshToken);

        // Assert
        assertThat(claims.get("type")).isEqualTo("refresh");
    }

    // ==================== 辅助方法 ====================

    private String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(KEY)
                .compact();
    }

    private String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION * 7); // 7天

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("type", "refresh")
                .signWith(KEY)
                .compact();
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}