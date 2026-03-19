package com.gio.controller.admin;

import com.gio.common.Result;
import com.gio.dto.LoginRequest;
import com.gio.dto.LoginResponse;
import com.gio.entity.AdminUser;
import com.gio.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 后台管理 - 登录接口
 */
@RestController
@RequestMapping("/api/admin")
public class AdminLoginController {

    @Autowired
    private AdminService adminService;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = adminService.login(request);
        return Result.success(response);
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/me")
    public Result<AdminUser> getCurrentUser() {
        // 从 SecurityContext 获取当前用户
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Result.unauthorized("未登录");
        }
        String username = authentication.getName();
        AdminUser user = adminService.getByUsername(username);
        if (user != null) {
            user.setPassword(null); // 不返回密码
        }
        return Result.success(user);
    }

    /**
     * 退出登录（前端删除 token 即可，这里可以记录日志）
     */
    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
