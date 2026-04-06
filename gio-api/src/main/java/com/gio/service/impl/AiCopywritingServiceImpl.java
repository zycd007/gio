package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gio.common.exception.BusinessException;
import com.gio.dto.AiCopywritingResponse;
import com.gio.dto.CopywritingCreateRequest;
import com.gio.dto.CopywritingDTO;
import com.gio.dto.FreeCopywritingRequest;
import com.gio.dto.PageResult;
import com.gio.entity.AiCopywriting;
import com.gio.entity.Category;
import com.gio.entity.Project;
import com.gio.mapper.AiCopywritingMapper;
import com.gio.service.AiCopywritingService;
import com.gio.service.CategoryService;
import com.gio.service.ProjectService;
import okhttp3.*;
import okio.Buffer;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

/**
 * AI 文案生成服务实现
 * 调用通义千问 API 生成小红书文案
 */
@Service
public class AiCopywritingServiceImpl implements AiCopywritingService {

    private static final Logger logger = LoggerFactory.getLogger(AiCopywritingServiceImpl.class);

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(120, java.util.concurrent.TimeUnit.SECONDS)
            .build();

    @Value("${ai.dashscope.api-key}")
    private String apiKey;

    @Value("${ai.dashscope.base-url}")
    private String baseUrl;

    @Value("${ai.dashscope.model:qwen3.5-plus}")
    private String model;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AiCopywritingMapper aiCopywritingMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AiCopywritingResponse generateCopywriting(Integer projectId, String style) {
        // 获取项目信息
        Project project = projectService.getById(projectId);
        if (project == null) {
            throw BusinessException.notFound("项目不存在");
        }

        // 获取分类信息
        Category category = categoryService.getById(project.getCategoryId());
        String categoryName = category != null ? category.getName() : "未分类";

        // 构建 System Prompt
        String systemPrompt = buildSystemPrompt(style);

        // 构建 User Prompt
        String userPrompt = buildUserPrompt(project, categoryName);

        // 调用通义千问 API
        String responseContent = callDashScopeApi(systemPrompt, userPrompt);

        // 解析响应
        return parseResponse(responseContent);
    }

    @Override
    public void generateCopywritingStream(Integer projectId, String style, SseEmitter emitter) {
        // 获取项目信息
        Project project = projectService.getById(projectId);
        if (project == null) {
            throw BusinessException.notFound("项目不存在");
        }

        // 获取分类信息
        Category category = categoryService.getById(project.getCategoryId());
        String categoryName = category != null ? category.getName() : "未分类";

        // 构建 System Prompt
        String systemPrompt = buildSystemPrompt(style);

        // 构建 User Prompt
        String userPrompt = buildUserPrompt(project, categoryName);

        // 调用通义千问流式 API
        callDashScopeApiStream(systemPrompt, userPrompt, emitter);
    }

    /**
     * 构建 System Prompt
     */
    private String buildSystemPrompt(String style) {
        StringBuilder sb = new StringBuilder();
        sb.append("你是一位资深的小红书内容运营专家，擅长创作高互动率的设计类内容。\n");
        sb.append("请根据提供的项目信息，创作符合小红书平台调性的文案。\n\n");
        sb.append("文案要求：\n");
        sb.append("1. 标题：15-25 字，使用 emoji，制造好奇或突出亮点\n");
        sb.append("2. 正文：200-400 字，分 2-3 段，适当使用 emoji 点缀\n");
        sb.append("3. 标签：5-10 个，包含大类目和精准长尾词\n");
        sb.append("4. 语气：根据选择的风格调整\n");
        sb.append("5. 避免：过度营销感、虚假夸张、敏感词\n\n");

        // 根据风格调整语气
        sb.append("【文案风格】");
        switch (style) {
            case "professional":
                sb.append("专业权威语气，突出设计奖项、技术亮点，语言严谨有深度。\n");
                break;
            case "seed":
                sb.append("热情种草语气，多用感叹句和 emoji，营造强烈推荐感。\n");
                break;
            case "story":
                sb.append("叙事性语气，从业主需求或设计挑战切入，有故事感和代入感。\n");
                break;
            case "minimal":
                sb.append("简洁克制语气，用最少文字传递核心信息，留白有格调。\n");
                break;
            default:
                sb.append("专业权威语气，突出设计奖项、技术亮点。\n");
        }

        sb.append("\n【输出格式】请严格按照以下 JSON 格式输出，不要有其他多余内容：\n");
        sb.append("{\n");
        sb.append("  \"title\": \"标题内容\",\n");
        sb.append("  \"content\": \"正文内容\",\n");
        sb.append("  \"tags\": [\"标签 1\", \"标签 2\", ...]\n");
        sb.append("}");

        return sb.toString();
    }

    /**
     * 构建 User Prompt
     */
    private String buildUserPrompt(Project project, String categoryName) {
        StringBuilder sb = new StringBuilder();
        sb.append("请为以下设计项目创作小红书文案：\n\n");
        sb.append("【项目信息】\n");
        sb.append("- 项目名称：").append(project.getName() != null ? project.getName() : "未命名").append("\n");
        sb.append("- 项目位置：").append(project.getLocation() != null ? project.getLocation() : "未填写").append("\n");
        sb.append("- 设计年份：").append(project.getYear() != null ? project.getYear() : "未填写").append("\n");
        sb.append("- 项目分类：").append(categoryName).append("\n");
        sb.append("- 项目描述：").append(project.getDescription() != null ? project.getDescription() : "暂无描述").append("\n");

        return sb.toString();
    }

    /**
     * 调用通义千问 API（非流式）
     */
    private String callDashScopeApi(String systemPrompt, String userPrompt) {
        String url = baseUrl + "/chat/completions";

        // 构建请求体
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", model);

        // 构建 messages 数组
        JSONArray messages = new JSONArray();

        // System message
        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.put(systemMessage);

        // User message
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);
        messages.put(userMessage);

        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.8);
        requestBody.put("max_tokens", 1000);

        // 创建 HTTP 请求
        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorMsg = response.body() != null ? response.body().string() : "未知错误";
                logger.error("调用通义千问 API 失败：{} {}", response.code(), errorMsg);
                throw new BusinessException("调用 AI 服务失败：" + response.code() + " " + errorMsg);
            }

            String responseBody = response.body().string();
            logger.info("通义千问 API 响应：{}", responseBody);

            // 解析响应
            JSONObject jsonResponse = new JSONObject(responseBody);
            JSONArray choices = jsonResponse.getJSONArray("choices");
            if (choices.length() > 0) {
                JSONObject choice = choices.getJSONObject(0);
                JSONObject message = choice.getJSONObject("message");
                return message.getString("content");
            }

            throw new BusinessException("AI 响应格式异常");

        } catch (IOException e) {
            logger.error("调用通义千问 API 异常", e);
            throw new BusinessException("调用 AI 服务异常：" + e.getMessage());
        }
    }

    /**
     * 调用通义千问流式 API
     */
    private void callDashScopeApiStream(String systemPrompt, String userPrompt, SseEmitter emitter) {
        String url = baseUrl + "/chat/completions";

        // 构建请求体
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", model);

        // 构建 messages 数组
        JSONArray messages = new JSONArray();

        // System message
        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.put(systemMessage);

        // User message
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", userPrompt);
        messages.put(userMessage);

        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.8);
        requestBody.put("max_tokens", 1000);
        requestBody.put("stream", true); // 启用流式输出

        // 创建 HTTP 请求
        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        // 使用 Callback 异步处理
        httpClient.newCall(request).enqueue(new Callback() {
            private final StringBuilder contentBuilder = new StringBuilder();

            @Override
            public void onFailure(Call call, IOException e) {
                logger.error("流式调用失败", e);
                safeSendError(emitter, e.getMessage());
                safeCompleteWithError(emitter, e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    String errorMsg = response.body() != null ? response.body().string() : "未知错误";
                    logger.error("流式调用失败：{} {}", response.code(), errorMsg);
                    safeSendError(emitter, errorMsg);
                    safeCompleteWithError(emitter, new RuntimeException("AI 调用失败：" + response.code()));
                    return;
                }

                try (okio.BufferedSource source = response.body().source()) {
                    String line;
                    while ((line = source.readUtf8LineStrict()) != null) {
                        if (line.startsWith("data: ")) {
                            String data = line.substring(6);
                            if ("[DONE]".equals(data)) {
                                break;
                            }

                            try {
                                JSONObject json = new JSONObject(data);
                                JSONArray choices = json.optJSONArray("choices");
                                if (choices != null && choices.length() > 0) {
                                    JSONObject delta = choices.getJSONObject(0).optJSONObject("delta");
                                    if (delta != null) {
                                        // 优先使用 content 字段，如果为 null 则使用 reasoning_content（阿里云通义千问思考模式）
                                        String content = null;
                                        if (delta.has("content") && !delta.isNull("content")) {
                                            content = delta.getString("content");
                                        } else if (delta.has("reasoning_content") && !delta.isNull("reasoning_content")) {
                                            content = delta.getString("reasoning_content");
                                        }

                                        if (content != null) {
                                            contentBuilder.append(content);
                                            // 发送 SSE 事件 - 添加日志调试
                                            logger.info("SSE 发送内容：[{}]", content);
                                            safeSendContent(emitter, content);
                                        }
                                    }
                                }
                            } catch (Exception e) {
                                // ignore parse error
                            }
                        }
                    }

                    // 发送完成事件 - 直接发送累积的内容（AI 返回的完整 JSON 字符串）
                    safeSendComplete(emitter, contentBuilder.toString());
                    safeComplete(emitter);

                } catch (Exception e) {
                    logger.error("流式读取异常", e);
                    safeSendError(emitter, e.getMessage());
                    safeCompleteWithError(emitter, e);
                }
            }
        });
    }

    /**
     * 安全发送 SSE content 事件（如果 emitter 已关闭则忽略）
     */
    private void safeSendContent(SseEmitter emitter, String content) {
        try {
            // 使用 SseEmitter.event() 构建完整的 SSE 事件
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .name("content")
                    .data(content);
            emitter.send(event);
        } catch (IllegalStateException | IOException e) {
            // emitter 已关闭，忽略
        }
    }

    /**
     * 安全发送 SSE complete 事件
     */
    private void safeSendComplete(SseEmitter emitter, String content) {
        try {
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .name("complete")
                    .data(content);
            emitter.send(event);
        } catch (IllegalStateException | IOException e) {
            // emitter 已关闭，忽略
        }
    }

    /**
     * 安全发送 SSE error 事件
     */
    private void safeSendError(SseEmitter emitter, String message) {
        try {
            JSONObject errorJson = new JSONObject();
            errorJson.put("error", message);
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .name("error")
                    .data(errorJson.toString());
            emitter.send(event);
        } catch (IllegalStateException | IOException e) {
            // emitter 已关闭，忽略
        }
    }

    /**
     * 安全关闭 emitter
     */
    private void safeComplete(SseEmitter emitter) {
        try {
            emitter.complete();
        } catch (IllegalStateException e) {
            // emitter 已关闭，忽略
        }
    }

    /**
     * 安全以错误方式关闭 emitter
     */
    private void safeCompleteWithError(SseEmitter emitter, Throwable e) {
        try {
            emitter.completeWithError(e);
        } catch (IllegalStateException ex) {
            // emitter 已关闭，忽略
        }
    }

    /**
     * 解析 AI 响应
     */
    private AiCopywritingResponse parseResponse(String content) {
        AiCopywritingResponse response = new AiCopywritingResponse();

        try {
            // 清理内容，提取 JSON 部分
            String jsonContent = content.trim();

            // 尝试找到 JSON 开始和结束位置
            int startIndex = jsonContent.indexOf("{");
            int endIndex = jsonContent.lastIndexOf("}");

            if (startIndex >= 0 && endIndex > startIndex) {
                jsonContent = jsonContent.substring(startIndex, endIndex + 1);
            }

            JSONObject json = new JSONObject(jsonContent);

            response.setTitle(json.optString("title", ""));
            response.setContent(json.optString("content", ""));

            // 解析 tags 数组
            JSONArray tagsArray = json.optJSONArray("tags");
            if (tagsArray != null) {
                List<String> tagsList = new ArrayList<>();
                for (int i = 0; i < tagsArray.length(); i++) {
                    tagsList.add(tagsArray.getString(i));
                }
                response.setTags(tagsList.toArray(new String[0]));
            }

            logger.info("AI 文案解析成功：title={}, content length={}, tags count={}",
                    response.getTitle(),
                    response.getContent() != null ? response.getContent().length() : 0,
                    response.getTags() != null ? response.getTags().length : 0);

        } catch (Exception e) {
            logger.error("解析 AI 响应失败：{}", content, e);
            // 解析失败时返回原始内容作为 content
            response.setContent(content);
            response.setTitle("AI 生成失败");
            response.setTags(new String[]{"AI 生成失败"});
        }

        return response;
    }

    /**
     * JSON 转义
     */
    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    // ==================== 推文管理相关方法 ====================

    @Override
    public void generateFreeCopywritingStream(FreeCopywritingRequest request, SseEmitter emitter) {
        // 构建 System Prompt（与项目生成相同）
        String systemPrompt = buildSystemPrompt(request.getStyle());

        // 构建 User Prompt（基于图片和描述）
        String userPrompt = buildFreeUserPrompt(request);

        // 调用通义千问流式 API
        callDashScopeApiStream(systemPrompt, userPrompt, emitter);
    }

    /**
     * 构建自由创作模式的 User Prompt
     */
    private String buildFreeUserPrompt(FreeCopywritingRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("请根据以下设计图片和描述创作小红书文案：\n\n");
        sb.append("【图片信息】\n");
        sb.append("- 图片数量：").append(request.getCustomImages() != null ?
            parseJsonArrayLength(request.getCustomImages()) : 0).append(" 张\n");
        sb.append("【用户描述】\n");
        sb.append(request.getDescription() != null ? request.getDescription() : "暂无描述").append("\n");
        sb.append("\n请基于以上信息创作符合小红书平台调性的文案。\n");

        return sb.toString();
    }

    /**
     * 解析 JSON 数组长度
     */
    private int parseJsonArrayLength(String jsonStr) {
        try {
            JSONArray array = new JSONArray(jsonStr);
            return array.length();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @Transactional
    public CopywritingDTO saveCopywriting(CopywritingCreateRequest request) {
        AiCopywriting copywriting = new AiCopywriting();
        copywriting.setProjectId(request.getProjectId());
        copywriting.setTitle(request.getTitle());
        copywriting.setContent(request.getContent());
        copywriting.setTags(request.getTags());
        copywriting.setStyle(request.getStyle());
        copywriting.setSourceType(request.getSourceType());
        copywriting.setCustomImages(request.getCustomImages());
        copywriting.setCustomDescription(request.getCustomDescription());
        copywriting.setStatus(request.getStatus());

        aiCopywritingMapper.insert(copywriting);

        // 如果是项目生成模式，更新项目的 has_copywriting 字段
        if (request.getProjectId() != null && request.getSourceType() == 1) {
            Project project = projectService.getById(request.getProjectId());
            if (project != null) {
                project.setHasCopywriting(1);
                projectService.updateById(project);
            }
        }

        return getCopywritingDetail(copywriting.getId());
    }

    @Override
    public PageResult<CopywritingDTO> getCopywritingList(Integer page, Integer size, Integer projectId,
                                                          Integer status, Integer sourceType, String keyword) {
        // 构建查询条件
        LambdaQueryWrapper<AiCopywriting> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AiCopywriting::getDeleted, 0); // 只查未删除的

        if (projectId != null) {
            wrapper.eq(AiCopywriting::getProjectId, projectId);
        }
        if (status != null) {
            wrapper.eq(AiCopywriting::getStatus, status);
        }
        if (sourceType != null) {
            wrapper.eq(AiCopywriting::getSourceType, sourceType);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(AiCopywriting::getTitle, keyword)
                              .or().like(AiCopywriting::getContent, keyword));
        }

        // 按创建时间倒序
        wrapper.orderByDesc(AiCopywriting::getCreatedAt);

        // 分页查询
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<AiCopywriting> mpPage =
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page, size);
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<AiCopywriting> resultPage =
            aiCopywritingMapper.selectPage(mpPage, wrapper);

        // 转换为 DTO
        List<CopywritingDTO> dtoList = resultPage.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PageResult.of(dtoList, resultPage.getTotal(), page, size);
    }

    @Override
    public CopywritingDTO getCopywritingDetail(Integer id) {
        AiCopywriting copywriting = aiCopywritingMapper.selectById(id);
        if (copywriting == null || copywriting.getDeleted() == 1) {
            return null;
        }
        return convertToDTO(copywriting);
    }

    @Override
    @Transactional
    public CopywritingDTO updateCopywriting(Integer id, CopywritingCreateRequest request) {
        AiCopywriting copywriting = aiCopywritingMapper.selectById(id);
        if (copywriting == null || copywriting.getDeleted() == 1) {
            throw BusinessException.notFound("推文不存在");
        }

        copywriting.setTitle(request.getTitle());
        copywriting.setContent(request.getContent());
        copywriting.setTags(request.getTags());
        copywriting.setStyle(request.getStyle());
        copywriting.setStatus(request.getStatus());

        aiCopywritingMapper.updateById(copywriting);

        return getCopywritingDetail(id);
    }

    @Override
    @Transactional
    public boolean deleteCopywriting(Integer id) {
        AiCopywriting copywriting = aiCopywritingMapper.selectById(id);
        if (copywriting == null || copywriting.getDeleted() == 1) {
            return false;
        }

        // 逻辑删除
        copywriting.setDeleted(1);
        aiCopywritingMapper.updateById(copywriting);

        // 如果是项目关联的推文，检查是否还有其他推文，没有则更新项目的 has_copywriting 字段
        if (copywriting.getProjectId() != null) {
            LambdaQueryWrapper<AiCopywriting> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(AiCopywriting::getProjectId, copywriting.getProjectId())
                   .eq(AiCopywriting::getDeleted, 0);
            Long count = aiCopywritingMapper.selectCount(wrapper);

            if (count == 0) {
                Project project = projectService.getById(copywriting.getProjectId());
                if (project != null) {
                    project.setHasCopywriting(0);
                    projectService.updateById(project);
                }
            }
        }

        return true;
    }

    @Override
    public void regenerateCopywritingStream(Integer id, String style, SseEmitter emitter) {
        AiCopywriting copywriting = aiCopywritingMapper.selectById(id);
        if (copywriting == null || copywriting.getDeleted() == 1) {
            safeSendError(emitter, "推文不存在");
            safeCompleteWithError(emitter, new RuntimeException("推文不存在"));
            return;
        }

        if (copywriting.getProjectId() != null) {
            // 项目生成模式
            generateCopywritingStream(copywriting.getProjectId(), style, emitter);
        } else {
            // 自由创作模式
            FreeCopywritingRequest request = new FreeCopywritingRequest();
            request.setCustomImages(copywriting.getCustomImages());
            request.setDescription(copywriting.getCustomDescription());
            request.setStyle(style);
            generateFreeCopywritingStream(request, emitter);
        }
    }

    @Override
    public List<CopywritingDTO> getProjectCopywritings(Integer projectId) {
        LambdaQueryWrapper<AiCopywriting> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AiCopywriting::getProjectId, projectId)
               .eq(AiCopywriting::getDeleted, 0)
               .orderByDesc(AiCopywriting::getCreatedAt);

        List<AiCopywriting> list = aiCopywritingMapper.selectList(wrapper);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * 将实体转换为 DTO
     */
    private CopywritingDTO convertToDTO(AiCopywriting copywriting) {
        CopywritingDTO dto = new CopywritingDTO();
        BeanUtils.copyProperties(copywriting, dto);

        // 设置风格显示名称
        dto.setStyleName(getStyleName(copywriting.getStyle()));

        // 解析 tags JSON 字符串为 List
        if (copywriting.getTags() != null && !copywriting.getTags().isEmpty()) {
            try {
                List<String> tagsList = objectMapper.readValue(
                    copywriting.getTags(),
                    new TypeReference<List<String>>() {}
                );
                dto.setTags(tagsList);
            } catch (Exception e) {
                // 解析失败，尝试直接分割
                dto.setTags(List.of(copywriting.getTags().split(",")));
            }
        } else {
            dto.setTags(new ArrayList<>());
        }

        // 关联项目名称
        if (copywriting.getProjectId() != null) {
            Project project = projectService.getById(copywriting.getProjectId());
            if (project != null) {
                dto.setProjectName(project.getName());
                dto.setProjectCoverImage("/api/images/" + project.getCoverImageId());
            }
        }

        return dto;
    }

    /**
     * 获取风格显示名称
     */
    private String getStyleName(String style) {
        switch (style) {
            case "professional": return "专业权威";
            case "seed": return "热情种草";
            case "story": return "叙事性";
            case "minimal": return "简洁克制";
            default: return style;
        }
    }
}
