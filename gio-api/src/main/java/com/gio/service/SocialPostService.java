package com.gio.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gio.dto.AiImageGenerateRequest;
import com.gio.dto.AiImageGenerateResponse;
import com.gio.dto.PageResult;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.entity.SocialPost;

/**
 * 小红书推文服务接口
 */
public interface SocialPostService extends IService<SocialPost> {

    /**
     * 生成推文（AI）
     */
    SocialPostDTO generatePost(SocialPostGenerateRequest request);

    /**
     * 分页获取推文列表
     */
    PageResult<SocialPostListItemDTO> getPostList(Integer page, Integer size, String type, Integer status, String keyword);

    /**
     * 获取推文详情
     */
    SocialPostDTO getPostDetail(Integer id);

    /**
     * 更新推文内容
     */
    SocialPostDTO updatePost(Integer id, SocialPostDTO dto);

    /**
     * 删除推文
     */
    boolean deletePost(Integer id);

    /**
     * 更新发布状态
     */
    boolean updatePublishStatus(Integer id, Integer status, String platform, String url);

    /**
     * 为推文生成AI配图
     */
    AiImageGenerateResponse generateAiImages(Integer postId, AiImageGenerateRequest request);

    /**
     * 删除单张AI配图
     */
    boolean deleteAiImage(Integer postId, Integer attachmentId);
}
