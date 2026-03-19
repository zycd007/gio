package com.gio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 首页控制器 - C 端
 */
@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String index() {
        return "<html><body>" +
                "<h1>GIO Portal - C 端官网</h1>" +
                "<p>API 接口地址：</p>" +
                "<ul>" +
                "<li><a href='/api/categories'>GET /api/categories</a> - 获取分类列表</li>" +
                "<li><a href='/api/projects'>GET /api/projects</a> - 获取项目列表</li>" +
                "</ul>" +
                "</body></html>";
    }
}
