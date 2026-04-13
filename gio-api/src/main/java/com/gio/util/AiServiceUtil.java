package com.gio.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

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

    @Value("${ai.dashscope.image-model:wanx-v1}")
    private String imageModel;

    @Value("${ai.dashscope.image-url:https://dashscope.aliyuncs.com/compatible-mode/v1/images/generations}")
    private String imageUrl;

    @Value("${ai.dashscope.image-size:1024*1024}")
    private String imageSize;

    @Value("${ai.dashscope.max-images-per-call:4}")
    private Integer maxImagesPerCall;

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
                    .timeout(Duration.ofSeconds(120))
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

    /**
     * 生成配图提示词（基于推文标题和正文）
     *
     * @param title      推文标题
     * @param content    推文正文
     * @param styleHint  风格提示（可选）
     * @return 图像生成提示词
     */
    public String generateImagePrompt(String title, String content, String styleHint) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("请根据以下小红书推文内容，生成一个用于AI图像生成的详细提示词。\n");
        prompt.append("提示词要求：\n");
        prompt.append("1. 描述要与推文主题相关，突出照明设计的美感和氛围\n");
        prompt.append("2. 使用英文描述（AI图像生成模型更擅长英文）\n");
        prompt.append("3. 包含光线效果、场景氛围、材质质感等细节\n");
        prompt.append("4. 添加专业摄影相关的关键词，如\"professional photography\", \"high quality\", \"4K\"\n");
        prompt.append("5. 如果有风格提示，请融入该风格\n\n");
        prompt.append("推文标题：").append(title).append("\n");
        prompt.append("推文正文：").append(content).append("\n");
        if (styleHint != null && !styleHint.isEmpty()) {
            prompt.append("风格偏好：").append(styleHint).append("\n");
        }
        prompt.append("\n请直接输出英文图像描述提示词，不要添加任何其他说明：");

        return generateContent(prompt.toString());
    }

    /**
     * 调用通义万相生成图片
     *
     * @param imagePrompt 图像生成提示词
     * @param count       生成数量（1-4张，超过需要分批）
     * @return 生成的图片Base64列表
     */
    public List<String> generateImages(String imagePrompt, int count) {
        try {
            // 单次最多生成 maxImagesPerCall 张
            int actualCount = Math.min(count, maxImagesPerCall);

            String requestBody = buildImageRequestBody(imagePrompt, actualCount);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(imageUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(120))
                    .build();

            log.info("调用通义万相 API, prompt: {}, count: {}", imagePrompt.substring(0, Math.min(50, imagePrompt.length())), actualCount);

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseImageResponse(response.body());
            } else {
                log.error("通义万相 API 调用失败, status: {}, body: {}", response.statusCode(), response.body());
                throw new RuntimeException("AI 图片生成失败: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("AI 图片生成异常: {}", e.getMessage(), e);
            throw new RuntimeException("AI 图片生成异常: " + e.getMessage());
        }
    }

    /**
     * 构建图像生成请求体
     */
    private String buildImageRequestBody(String imagePrompt, int count) {
        try {
            ObjectNode rootNode = objectMapper.createObjectNode();
            ObjectNode inputNode = objectMapper.createObjectNode();
            ObjectNode parametersNode = objectMapper.createObjectNode();

            inputNode.put("prompt", imagePrompt);
            parametersNode.put("size", imageSize).put("n", count);

            rootNode.put("model", imageModel);
            rootNode.set("input", inputNode);
            rootNode.set("parameters", parametersNode);

            return objectMapper.writeValueAsString(rootNode);
        } catch (Exception e) {
            throw new RuntimeException("构建图像请求体失败", e);
        }
    }

    /**
     * 解析图像生成响应
     */
    private List<String> parseImageResponse(String responseBody) {
        try {
            List<String> images = new ArrayList<>();
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode output = root.path("output");
            JsonNode results = output.path("results");

            if (results.isArray()) {
                for (JsonNode result : results) {
                    // 优先使用 base64 数据
                    String b64Image = result.path("b64_image").asText(null);
                    if (b64Image != null && !b64Image.isEmpty()) {
                        images.add(b64Image);
                    } else {
                        // 如果没有 base64，使用 URL（需要后续下载）
                        String url = result.path("url").asText(null);
                        if (url != null && !url.isEmpty()) {
                            // 下载图片并转为 base64
                            images.add(downloadImageAsBase64(url));
                        }
                    }
                }
            }

            log.info("AI 图片生成成功, 数量: {}", images.size());
            return images;
        } catch (Exception e) {
            throw new RuntimeException("解析图像响应失败", e);
        }
    }

    /**
     * 下载图片并转为 Base64
     */
    private String downloadImageAsBase64(String imageUrl) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(imageUrl))
                    .GET()
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                byte[] imageBytes = response.body();
                return Base64.getEncoder().encodeToString(imageBytes);
            } else {
                throw new RuntimeException("下载图片失败: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("下载图片异常: {}", e.getMessage(), e);
            throw new RuntimeException("下载图片异常: " + e.getMessage());
        }
    }
}