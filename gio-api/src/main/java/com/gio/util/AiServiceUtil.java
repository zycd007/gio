package com.gio.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * AI 服务工具类 - 调用通义千问 API
 */
@Component
@Slf4j
public class AiServiceUtil {

    @Value("${ai.dashscope.api-key}")
    private String apiKey;

    @Value("${ai.dashscope.base-url}")
    private String baseUrl;

    @Value("${ai.dashscope.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 生成小红书推文内容
     *
     * @param prompt 提示词
     * @return 生成的文本内容
     */
    public String generateContent(String prompt) {
        try {
            String requestBody = buildRequestBody(prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(60))
                    .build();

            log.info("调用 AI API, prompt长度: {}", prompt.length());

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseResponse(response.body());
            } else {
                log.error("AI API 调用失败, status: {}, body: {}", response.statusCode(), response.body());
                throw new RuntimeException("AI 生成失败: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("AI 生成异常: {}", e.getMessage(), e);
            throw new RuntimeException("AI 生成异常: " + e.getMessage());
        }
    }

    /**
     * 构建请求体
     */
    private String buildRequestBody(String prompt) {
        try {
            return objectMapper.writeValueAsString(objectMapper.createObjectNode()
                    .put("model", model)
                    .set("messages", objectMapper.createArrayNode()
                            .add(objectMapper.createObjectNode()
                                    .put("role", "user")
                                    .put("content", prompt))));
        } catch (Exception e) {
            throw new RuntimeException("构建请求体失败", e);
        }
    }

    /**
     * 解析响应
     */
    private String parseResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.path("choices");

            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                String content = message.path("content").asText();
                log.info("AI 生成成功, 内容长度: {}", content.length());
                return content;
            } else {
                log.error("AI 响应格式异常: {}", responseBody);
                throw new RuntimeException("AI 响应格式异常");
            }
        } catch (Exception e) {
            throw new RuntimeException("解析响应失败", e);
        }
    }
}