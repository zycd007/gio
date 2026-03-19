package com.gio.service;

import com.gio.dto.LoginRequest;
import com.gio.dto.LoginResponse;
import com.gio.entity.AdminUser;

/**
 * 管理员服务接口
 */
public interface AdminService {

    /**
     * 管理员登录
     */
    LoginResponse login(LoginRequest request);

    /**
     * 根据用户名获取管理员
     */
    AdminUser getByUsername(String username);

    /**
     * 验证 Token
     */
    boolean verifyToken(String token);

    /**
     * 从 Token 中获取用户名
     */
    String getUsernameFromToken(String token);
}
