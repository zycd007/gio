package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.common.exception.BusinessException;
import com.gio.dto.PageResult;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.entity.Project;
import com.gio.entity.SocialPost;
import com.gio.mapper.ProjectMapper;
import com.gio.mapper.SocialPostMapper;
import com.gio.service.SocialPostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // 生成推文内容（这里使用模拟数据，实际应调用 AI API）
        String generatedTitle = "Generated Title";
        String generatedContent = "这是一篇自动生成的小红书推文内容。\n\n更多内容...";

        // TODO: 调用通义千问 AI 生成推文内容

        // 保存推文
        SocialPost post = new SocialPost();
        post.setType(request.getType());
        post.setProjectId(request.getProjectId());
        post.setTitle(generatedTitle);
        post.setContent(generatedContent);
        post.setStatus(0); // 草稿状态
        post.setTags("");
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
}
