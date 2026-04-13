package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.common.exception.BusinessException;
import com.gio.dto.AiImageGenerateRequest;
import com.gio.dto.AiImageGenerateResponse;
import com.gio.dto.PageResult;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.entity.Attachment;
import com.gio.entity.Project;
import com.gio.entity.ProjectImage;
import com.gio.entity.SocialPost;
import com.gio.mapper.AttachmentMapper;
import com.gio.mapper.ProjectMapper;
import com.gio.mapper.ProjectImageMapper;
import com.gio.mapper.SocialPostMapper;
import com.gio.service.SocialPostService;
import com.gio.util.AiServiceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 小红书推文服务实现
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SocialPostServiceImpl extends ServiceImpl<SocialPostMapper, SocialPost> implements SocialPostService {

    private final SocialPostMapper socialPostMapper;
    private final ProjectMapper projectMapper;
    private final ProjectImageMapper projectImageMapper;
    private final AttachmentMapper attachmentMapper;
    private final AiServiceUtil aiServiceUtil;

    @Value("${ai.dashscope.api-key}")
    private String apiKey;

    @Value("${ai.dashscope.base-url}")
    private String baseUrl;

    @Value("${ai.dashscope.model}")
    private String model;

    @Override
    public SocialPostDTO generatePost(SocialPostGenerateRequest request) {
        log.info("开始生成推文，类型: {}, 项目ID: {}", request.getType(), request.getProjectId());

        // 验证请求参数
        if ("project".equals(request.getType())) {
            if (request.getProjectId() == null) {
                throw new BusinessException("项目类型需要提供项目ID");
            }
            Project project = projectMapper.selectById(request.getProjectId());
            if (project == null) {
                throw new BusinessException("项目不存在");
            }
        }

        // 构建AI提示词并生成内容
        String prompt = buildPrompt(request);
        String aiResponse = aiServiceUtil.generateContent(prompt);

        // 解析AI响应，提取标题、正文和标签
        String generatedTitle = extractTitle(aiResponse);
        String generatedContent = extractContent(aiResponse);
        String generatedTags = extractTags(aiResponse);

        log.info("AI生成完成 - 标题: {}, 内容长度: {}, 标签: {}", generatedTitle, generatedContent.length(), generatedTags);

        // 保存推文
        SocialPost post = new SocialPost();
        post.setType(request.getType());
        post.setProjectId(request.getProjectId());
        post.setTitle(generatedTitle);
        post.setContent(generatedContent);
        post.setTags(generatedTags);
        post.setStatus(0); // 草稿状态
        if (request.getSelectedImageIds() != null) {
            post.setSelectedImages(String.join(",", request.getSelectedImageIds().stream().map(String::valueOf).collect(Collectors.toList())));
        }

        socialPostMapper.insert(post);

        // 转换为 DTO
        return convertToDTO(post);
    }

    @Override
    public PageResult<SocialPostListItemDTO> getPostList(Integer page, Integer size, String type, Integer status, String keyword) {
        if (page == null || page <= 0) page = 1;
        if (size == null || size <= 0) size = 10;

        Page<SocialPost> postPage = new Page<>(page, size);

        LambdaQueryWrapper<SocialPost> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SocialPost::getDeleted, 0);

        if (type != null && !type.trim().isEmpty()) {
            wrapper.eq(SocialPost::getType, type);
        }
        if (status != null) {
            wrapper.eq(SocialPost::getStatus, status);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.like(SocialPost::getTitle, keyword.trim())
                    .or()
                    .like(SocialPost::getContent, keyword.trim());
        }
        wrapper.orderByDesc(SocialPost::getId);

        // 执行分页查询
        IPage<SocialPost> pageInfo = socialPostMapper.selectPage(postPage, wrapper);

        // 转换为 ListItemDTO
        List<SocialPostListItemDTO> dtoList = pageInfo.getRecords().stream()
                .map(this::convertToListItemDTO)
                .collect(Collectors.toList());

        return PageResult.of(dtoList, pageInfo.getTotal(), page, size);
    }

    @Override
    public SocialPostDTO getPostDetail(Integer id) {
        SocialPost post = socialPostMapper.selectById(id);
        if (post == null || post.getDeleted() == 1) {
            throw new BusinessException("推文不存在");
        }
        return convertToDTO(post);
    }

    @Override
    @Transactional
    public SocialPostDTO updatePost(Integer id, SocialPostDTO dto) {
        SocialPost post = socialPostMapper.selectById(id);
        if (post == null || post.getDeleted() == 1) {
            throw new BusinessException("推文不存在");
        }

        // 更新字段
        if (dto.getTitle() != null) {
            post.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            post.setContent(dto.getContent());
        }
        if (dto.getTags() != null) {
            post.setTags(dto.getTags());
        }
        if (dto.getSelectedImages() != null) {
            post.setSelectedImages(String.join(",", dto.getSelectedImages().stream().map(String::valueOf).collect(Collectors.toList())));
        }
        if (dto.getStatus() != null) {
            post.setStatus(dto.getStatus());
        }

        socialPostMapper.updateById(post);
        return convertToDTO(post);
    }

    @Override
    @Transactional
    public boolean deletePost(Integer id) {
        SocialPost post = socialPostMapper.selectById(id);
        if (post == null) {
            return false;
        }

        // 逻辑删除
        post.setDeleted(1);
        return socialPostMapper.updateById(post) > 0;
    }

    @Override
    @Transactional
    public boolean updatePublishStatus(Integer id, Integer status, String platform, String url) {
        SocialPost post = socialPostMapper.selectById(id);
        if (post == null || post.getDeleted() == 1) {
            throw new BusinessException("推文不存在");
        }

        post.setStatus(status);
        if (platform != null && !platform.trim().isEmpty()) {
            post.setPublishPlatform(platform);
        }
        if (url != null && !url.trim().isEmpty()) {
            post.setPublishUrl(url);
        }

        return socialPostMapper.updateById(post) > 0;
    }

    // ========== 转换方法 ==========

    private SocialPostDTO convertToDTO(SocialPost post) {
        SocialPostDTO dto = new SocialPostDTO();
        dto.setId(post.getId());
        dto.setType(post.getType());
        dto.setProjectId(post.getProjectId());

        // 获取项目名称
        if (post.getProjectId() != null) {
            Project project = projectMapper.selectById(post.getProjectId());
            if (project != null) {
                dto.setProjectName(project.getName());
            }
        }

        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setTags(post.getTags());

        // 解析 selectedImages
        if (post.getSelectedImages() != null && !post.getSelectedImages().isEmpty()) {
            dto.setSelectedImages(
                List.of(post.getSelectedImages().split(","))
                    .stream()
                    .map(Integer::valueOf)
                    .collect(Collectors.toList())
            );
        }

        // 解析 aiImages
        if (post.getAiImages() != null && !post.getAiImages().isEmpty()) {
            dto.setAiImages(parseAiImagesJson(post.getAiImages()));
        }

        dto.setAiImagePrompt(post.getAiImagePrompt());
        dto.setAiImageCount(post.getAiImageCount());
        dto.setAiImageStatus(post.getAiImageStatus());

        dto.setStatus(post.getStatus());
        dto.setPublishPlatform(post.getPublishPlatform());
        dto.setPublishUrl(post.getPublishUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }

    private SocialPostListItemDTO convertToListItemDTO(SocialPost post) {
        SocialPostListItemDTO dto = new SocialPostListItemDTO();
        dto.setId(post.getId());
        dto.setType(post.getType());
        dto.setProjectId(post.getProjectId());

        // 获取项目名称
        if (post.getProjectId() != null) {
            Project project = projectMapper.selectById(post.getProjectId());
            if (project != null) {
                dto.setProjectName(project.getName());
            }
        }

        dto.setTitle(post.getTitle());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }

    // ========== AI 生成相关方法 ==========

    /**
     * 构建 AI 提示词
     */
    private String buildPrompt(SocialPostGenerateRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是一名专业的小红书内容创作者，为一家照明设计公司（光里光外）撰写推广文案。\n");
        prompt.append("公司专注于空间智能照明设计，理念是\"光里有故事，光外有生活\"。\n\n");

        if ("project".equals(request.getType())) {
            // 项目类型：基于项目信息生成
            Project project = projectMapper.selectById(request.getProjectId());
            if (project != null) {
                prompt.append("项目信息：\n");
                prompt.append("- 项目名称：").append(project.getName()).append("\n");
                if (project.getLocation() != null && !project.getLocation().isEmpty()) {
                    prompt.append("- 项目位置：").append(project.getLocation()).append("\n");
                }
                if (project.getYear() != null && !project.getYear().isEmpty()) {
                    prompt.append("- 完成年份：").append(project.getYear()).append("\n");
                }
                if (project.getDescription() != null && !project.getDescription().isEmpty()) {
                    prompt.append("- 项目描述：").append(project.getDescription()).append("\n");
                }
            }

            // 获取选中的图片信息
            if (request.getSelectedImageIds() != null && !request.getSelectedImageIds().isEmpty()) {
                prompt.append("\n已选中 ").append(request.getSelectedImageIds().size()).append(" 张项目图片用于配图。\n");
            }
        } else {
            // 自定义类型：基于用户输入生成
            if (request.getCustomContent() != null && !request.getCustomContent().isEmpty()) {
                prompt.append("用户需求描述：\n").append(request.getCustomContent()).append("\n");
            }
        }

        prompt.append("\n请生成一篇小红书推文，要求：\n");
        prompt.append("1. 标题吸引眼球，使用热门小红书标题风格\n");
        prompt.append("2. 正文内容生动有趣，突出照明设计的专业性和美感\n");
        prompt.append("3. 适当使用小红书常用语气和表达方式\n");
        prompt.append("4. 正文长度在200-400字左右\n");
        prompt.append("5. 添加3-5个相关标签，用#开头\n\n");
        prompt.append("请按以下格式输出（严格遵守）：\n");
        prompt.append("【标题】你的标题内容\n");
        prompt.append("【正文】你的正文内容\n");
        prompt.append("【标签】#标签1 #标签2 #标签3\n");

        return prompt.toString();
    }

    /**
     * 从 AI 响应中提取标题
     */
    private String extractTitle(String aiResponse) {
        if (aiResponse == null || aiResponse.isEmpty()) {
            return "AI生成推文";
        }

        // 查找【标题】标记
        int titleStart = aiResponse.indexOf("【标题】");
        if (titleStart >= 0) {
            titleStart += 4; // 跳过标记
            int titleEnd = aiResponse.indexOf("\n", titleStart);
            if (titleEnd < 0) {
                titleEnd = aiResponse.indexOf("【正文】", titleStart);
            }
            if (titleEnd > titleStart) {
                String title = aiResponse.substring(titleStart, titleEnd).trim();
                // 限制标题长度不超过 20 字
                return limitTitleLength(title);
            }
        }

        // 如果没有找到标记，取第一行作为标题
        int firstLineEnd = aiResponse.indexOf("\n");
        if (firstLineEnd > 0 && firstLineEnd < 50) {
            String title = aiResponse.substring(0, firstLineEnd).trim();
            // 限制标题长度不超过 20 字
            return limitTitleLength(title);
        }

        // 默认标题
        return limitTitleLength("照明设计分享");
    }

    /**
     * 限制标题长度不超过 20 字
     */
    private String limitTitleLength(String title) {
        if (title == null || title.length() <= 20) {
            return title;
        }
        // 超过 20 字，截断并添加省略号
        return title.substring(0, 17) + "...";
    }

    /**
     * 从 AI 响应中提取正文（限制 20 字以内）
     */
    private String extractContent(String aiResponse) {
        if (aiResponse == null || aiResponse.isEmpty()) {
            return "这是一篇AI生成的推文内容。";
        }

        // 查找【正文】标记
        int contentStart = aiResponse.indexOf("【正文】");
        if (contentStart >= 0) {
            contentStart += 4; // 跳过标记
            int contentEnd = aiResponse.indexOf("【标签】", contentStart);
            if (contentEnd > contentStart) {
                return aiResponse.substring(contentStart, contentEnd).trim();
            }
            // 如果没有标签标记，取剩余内容
            return aiResponse.substring(contentStart).trim();
        }

        // 如果没有找到标记，返回原文（去除可能的标题行）
        int firstLineEnd = aiResponse.indexOf("\n");
        if (firstLineEnd > 0) {
            return aiResponse.substring(firstLineEnd + 1).trim();
        }

        return aiResponse;
    }

    /**
     * 从 AI 响应中提取标签
     */
    private String extractTags(String aiResponse) {
        if (aiResponse == null || aiResponse.isEmpty()) {
            return "#照明设计 #光影艺术";
        }

        // 查找【标签】标记
        int tagsStart = aiResponse.indexOf("【标签】");
        if (tagsStart >= 0) {
            tagsStart += 4; // 跳过标记
            int tagsEnd = aiResponse.length();
            // 查找下一个换行或结束
            int nextLine = aiResponse.indexOf("\n", tagsStart);
            if (nextLine > tagsStart) {
                tagsEnd = nextLine;
            }
            String tags = aiResponse.substring(tagsStart, tagsEnd).trim();
            if (!tags.isEmpty()) {
                return tags;
            }
        }

        // 默认标签
        return "#照明设计 #空间设计 #光影艺术";
    }

    // ========== AI 配图生成方法 ==========

    @Override
    @Transactional
    public AiImageGenerateResponse generateAiImages(Integer postId, AiImageGenerateRequest request) {
        SocialPost post = socialPostMapper.selectById(postId);
        if (post == null || post.getDeleted() == 1) {
            throw new BusinessException("推文不存在");
        }

        int imageCount = request.getImageCount() != null ? request.getImageCount() : 3;
        if (imageCount < 1 || imageCount > 9) {
            throw new BusinessException("配图数量必须在 1-9 张之间");
        }

        // 更新状态为生成中
        post.setAiImageStatus(1);
        post.setAiImageCount(imageCount);
        socialPostMapper.updateById(post);

        try {
            // 1. 生成图像提示词
            String imagePrompt = aiServiceUtil.generateImagePrompt(
                    post.getTitle(),
                    post.getContent(),
                    request.getStylePrompt()
            );
            post.setAiImagePrompt(imagePrompt);

            // 2. 分批生成图片
            List<AiImageGenerateResponse.AiImageInfo> generatedImages = new ArrayList<>();
            int remaining = imageCount;
            int order = getExistingAiImageCount(post);

            while (remaining > 0) {
                int batchCount = Math.min(remaining, 4);
                List<String> batchImages = aiServiceUtil.generateImages(imagePrompt, batchCount);

                for (String base64Image : batchImages) {
                    // 保存图片到 Attachment 表
                    Attachment attachment = saveAiImageAttachment(base64Image);

                    AiImageGenerateResponse.AiImageInfo info = new AiImageGenerateResponse.AiImageInfo();
                    info.setAttachmentId(attachment.getId());
                    info.setUrl("/api/images/" + attachment.getId());
                    info.setPrompt(imagePrompt);
                    info.setOrder(++order);
                    generatedImages.add(info);
                }

                remaining -= batchCount;
            }

            // 3. 更新 aiImages JSON 字段
            updateAiImagesJson(post, generatedImages);

            // 4. 更新状态为已完成
            post.setAiImageStatus(2);
            socialPostMapper.updateById(post);

            AiImageGenerateResponse response = new AiImageGenerateResponse();
            response.setStatus(2);
            response.setTotalCount(imageCount);
            response.setCompletedCount(generatedImages.size());
            response.setMessage("AI配图生成成功");
            response.setImages(generatedImages);
            return response;

        } catch (Exception e) {
            log.error("AI配图生成失败: {}", e.getMessage(), e);
            post.setAiImageStatus(3);
            socialPostMapper.updateById(post);
            throw new BusinessException("AI配图生成失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean deleteAiImage(Integer postId, Integer attachmentId) {
        SocialPost post = socialPostMapper.selectById(postId);
        if (post == null || post.getDeleted() == 1) {
            throw new BusinessException("推文不存在");
        }

        // 从 aiImages JSON 中移除
        String aiImagesJson = post.getAiImages();
        if (aiImagesJson != null && !aiImagesJson.isEmpty()) {
            try {
                List<SocialPostDTO.AiImageInfo> aiImages = parseAiImagesJson(aiImagesJson);
                aiImages.removeIf(img -> img.getAttachmentId().equals(attachmentId));

                // 更新 JSON
                String updatedJson = buildAiImagesJson(aiImages);
                post.setAiImages(updatedJson);
                post.setAiImageCount(aiImages.size());

                // 删除 Attachment 记录
                attachmentMapper.deleteById(attachmentId);

                socialPostMapper.updateById(post);
                return true;
            } catch (Exception e) {
                log.error("删除AI配图失败: {}", e.getMessage(), e);
                throw new BusinessException("删除AI配图失败");
            }
        }
        return false;
    }

    /**
     * 获取现有AI配图数量
     */
    private int getExistingAiImageCount(SocialPost post) {
        String aiImagesJson = post.getAiImages();
        if (aiImagesJson == null || aiImagesJson.isEmpty()) {
            return 0;
        }
        try {
            List<SocialPostDTO.AiImageInfo> aiImages = parseAiImagesJson(aiImagesJson);
            return aiImages.size();
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 保存AI生成的图片到Attachment表
     */
    private Attachment saveAiImageAttachment(String base64Image) {
        Attachment attachment = new Attachment();
        attachment.setFileName("ai_image_" + System.currentTimeMillis() + ".png");
        attachment.setFileType("image/png");
        attachment.setBusinessType("ai_image");
        attachment.setBase64Data(base64Image);
        attachment.setCreatedAt(LocalDateTime.now());

        attachmentMapper.insert(attachment);
        return attachment;
    }

    /**
     * 更新 aiImages JSON 字段
     */
    private void updateAiImagesJson(SocialPost post, List<AiImageGenerateResponse.AiImageInfo> newImages) {
        String existingJson = post.getAiImages();
        List<SocialPostDTO.AiImageInfo> allImages = new ArrayList<>();

        if (existingJson != null && !existingJson.isEmpty()) {
            allImages.addAll(parseAiImagesJson(existingJson));
        }

        for (AiImageGenerateResponse.AiImageInfo info : newImages) {
            SocialPostDTO.AiImageInfo aiImageInfo = new SocialPostDTO.AiImageInfo();
            aiImageInfo.setAttachmentId(info.getAttachmentId());
            aiImageInfo.setUrl(info.getUrl());
            aiImageInfo.setPrompt(info.getPrompt());
            aiImageInfo.setGeneratedAt(LocalDateTime.now().toString());
            aiImageInfo.setSource("ai");
            aiImageInfo.setOrder(info.getOrder());
            allImages.add(aiImageInfo);
        }

        post.setAiImages(buildAiImagesJson(allImages));
    }

    /**
     * 解析 aiImages JSON
     */
    private List<SocialPostDTO.AiImageInfo> parseAiImagesJson(String json) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.core.type.TypeReference<List<SocialPostDTO.AiImageInfo>> typeRef =
                    new com.fasterxml.jackson.core.type.TypeReference<>() {};
            return mapper.readValue(json, typeRef);
        } catch (Exception e) {
            log.error("解析 aiImages JSON 失败: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 构建 aiImages JSON
     */
    private String buildAiImagesJson(List<SocialPostDTO.AiImageInfo> images) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.writeValueAsString(images);
        } catch (Exception e) {
            log.error("构建 aiImages JSON 失败: {}", e.getMessage());
            return "";
        }
    }
}
