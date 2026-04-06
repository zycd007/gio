package com.gio.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import com.gio.common.exception.BusinessException;
import com.gio.dto.LoginRequest;
import com.gio.dto.LoginResponse;
import com.gio.entity.AdminUser;
import com.gio.mapper.AdminUserMapper;
import com.gio.service.AdminService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 管理员服务实现
 */
@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    private final AdminUserMapper adminUserMapper;

    public AdminServiceImpl(AdminUserMapper adminUserMapper) {
        this.adminUserMapper = adminUserMapper;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());
        AdminUser user = getByUsername(request.getUsername());
        log.info("User found: {}", user != null ? user.getUsername() : "null");
        if (user == null) {
            throw new BusinessException("用户名或密码错误");
        }
        log.info("User status: {}", user.getStatus());
        if (user.getStatus() != 1) {
            throw new BusinessException("账号已被禁用");
        }
        // 验证密码 - 使用 BCrypt 验证
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        // 生成 Token
        String token = generateToken(user.getUsername());
        String refreshToken = generateRefreshToken(user.getUsername());

        return new LoginResponse(
                token,
                refreshToken,
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getRole()
        );
    }

    @Override
    public AdminUser getByUsername(String username) {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<AdminUser>();
        queryWrapper.eq("username", username);
        return adminUserMapper.selectOne(queryWrapper);
    }

    @Override
    public boolean verifyToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    private String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    private String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration * 7); // 7 天

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("type", "refresh")
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 加密密码（用于创建/更新管理员）
     */
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }
}
