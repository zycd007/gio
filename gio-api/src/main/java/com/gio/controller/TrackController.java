package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.DashboardStatsVO;
import com.gio.dto.PageViewRequest;
import com.gio.service.TrackService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/track")
public class TrackController {

    @Autowired
    private TrackService trackService;

    @PostMapping("/pageview")
    public Result<?> pageview(@RequestBody PageViewRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        trackService.trackPageView(ip, request.getPageUrl(), request.getReferrer(), request.getProjectId(), userAgent);
        return Result.success(null);
    }

    @PostMapping("/duration")
    public Result<?> duration(@RequestBody PageViewRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        trackService.trackDuration(ip, request.getPageUrl(), request.getProjectId(), request.getDuration());
        return Result.success(null);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
