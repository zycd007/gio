package com.gio.util;

/**
 * 设备类型分析工具类 - 解析 UserAgent 判断设备类型
 */
public class DeviceTypeAnalyzer {

    /**
     * 检测设备类型
     * @param userAgent 用户代理字符串
     * @return "mobile" | "tablet" | "desktop" | "unknown"
     */
    public static String detectDevice(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "unknown";
        }

        String ua = userAgent.toLowerCase();

        // 移动设备检测
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone") || ua.contains("ipod")) {
            return "mobile";
        }

        // 平板设备检测
        if (ua.contains("tablet") || ua.contains("ipad") || ua.contains("playbook")) {
            return "tablet";
        }

        // 其他移动设备特征
        if (ua.contains("windows phone") || ua.contains("opera mini") || ua.contains("opera mobi")) {
            return "mobile";
        }

        // 默认为桌面设备
        return "desktop";
    }

    /**
     * 是否为移动设备
     */
    public static boolean isMobile(String userAgent) {
        String device = detectDevice(userAgent);
        return "mobile".equals(device) || "tablet".equals(device);
    }
}
