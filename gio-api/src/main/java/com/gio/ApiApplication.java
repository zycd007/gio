package com.gio;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 统一后端服务启动类 - C端官网 + 后台管理
 */
@SpringBootApplication(scanBasePackages = {"com.gio"})
@MapperScan("com.gio.mapper")
@EnableScheduling
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
