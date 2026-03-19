package com.gio;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * C 端官网服务启动类 - 排除安全配置
 */
@SpringBootApplication(scanBasePackages = {"com.gio"})
@MapperScan("com.gio.mapper")
@ComponentScan(basePackages = {"com.gio"},
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = {"com\\.gio\\.config\\.SecurityConfig", "com\\.gio\\.config\\.JwtAuthenticationFilter"}
    ))
public class PortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }
}
