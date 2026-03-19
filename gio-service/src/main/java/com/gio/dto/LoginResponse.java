package com.gio.dto;

import lombok.Data;

/**
 * 登录响应 DTO
 */
@Data
public class LoginResponse {

    private String token;

    private String refreshToken;

    private Integer id;

    private String username;

    private String nickname;

    private String role;

    public LoginResponse(String token, String refreshToken, Integer id, String username, String nickname, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.role = role;
    }
}
