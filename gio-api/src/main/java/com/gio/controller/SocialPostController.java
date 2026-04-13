package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.AiImageGenerateRequest;
import com.gio.dto.AiImageGenerateResponse;
import com.gio.dto.PageResult;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.service.SocialPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 小红书推文管理控制器
 */
@RestController
@RequestMapping("/api/admin/social-posts")
@RequiredArgsConstructor
public class SocialPostController {

    private final SocialPostService socialPostService;

    /**
     * 生成推文（AI）
     */
    @PostMapping("/generate")
    public Result<SocialPostDTO> generatePost(@Valid @RequestBody SocialPostGenerateRequest request) {
        SocialPostDTO dto = socialPostService.generatePost(request);
        return Result.success(dto);
    }

    /**
     * 获取推文列表
     */
    @GetMapping
    public Result<PageResult<SocialPostListItemDTO>> getPostList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        PageResult<SocialPostListItemDTO> result = socialPostService.getPostList(page, size, type, status, keyword);
        return Result.success(result);
    }

    /**
     * 获取推文详情
     */
    @GetMapping("/{id}")
    public Result<SocialPostDTO> getPostDetail(@PathVariable Integer id) {
        SocialPostDTO dto = socialPostService.getPostDetail(id);
        return Result.success(dto);
    }

    /**
     * 更新推文
     */
    @PutMapping("/{id}")
    public Result<SocialPostDTO> updatePost(@PathVariable Integer id, @RequestBody SocialPostDTO dto) {
        SocialPostDTO updated = socialPostService.updatePost(id, dto);
        return Result.success(updated);
    }

    /**
     * 删除推文
     */
    @DeleteMapping("/{id}")
    public Result<Void> deletePost(@PathVariable Integer id) {
        socialPostService.deletePost(id);
        return Result.success();
    }

    /**
     * 更新发布状态
     */
    @PutMapping("/{id}/publish")
    public Result<Void> updatePublishStatus(
            @PathVariable Integer id,
            @RequestParam Integer status,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String url) {
        socialPostService.updatePublishStatus(id, status, platform, url);
        return Result.success();
    }

    /**
     * 为推文生成AI配图
     */
    @PostMapping("/{id}/ai-images")
    public Result<AiImageGenerateResponse> generateAiImages(
            @PathVariable Integer id,
            @RequestBody AiImageGenerateRequest request) {
        AiImageGenerateResponse response = socialPostService.generateAiImages(id, request);
        return Result.success(response);
    }

    /**
     * 删除单张AI配图
     */
    @DeleteMapping("/{id}/ai-images/{attachmentId}")
    public Result<Void> deleteAiImage(
            @PathVariable Integer id,
            @PathVariable Integer attachmentId) {
        socialPostService.deleteAiImage(id, attachmentId);
        return Result.success();
    }
}
