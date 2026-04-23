package com.gio;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

/**
 * 统一后端服务启动类 - C端官网 + 后台管理
 */
@SpringBootApplication(scanBasePackages = {"com.gio"})
@MapperScan("com.gio.mapper")
@EnableScheduling
public class ApiApplication {

    public static void main(String[] args) {
        // 强制设置 JVM 时区为北京时间，确保日期统计正确
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
        SpringApplication.run(ApiApplication.class, args);
    }
}
