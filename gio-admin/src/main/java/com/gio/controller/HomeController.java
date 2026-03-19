package com.gio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 首页控制器 - 后台管理
 */
@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String index() {
        return "<html><body>" +
                "<h1>GIO Admin - 后台管理系统</h1>" +
                "<p>API 接口地址：</p>" +
                "<ul>" +
                "<li><a href='/api/admin/login' target='_blank'>POST /api/admin/login</a> - 管理员登录</li>" +
                "<li>GET /api/admin/categories - 分类管理</li>" +
                "<li>GET /api/admin/projects - 项目管理</li>" +
                "</ul>" +
                "<p style='color:red;'>注意：管理接口需要 JWT Token 认证</p>" +
                "</body></html>";
    }
}
