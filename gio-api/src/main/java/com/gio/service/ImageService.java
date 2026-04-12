package com.gio.service;

import com.gio.dto.ImageSortDTO;
import com.gio.entity.ProjectImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 图片服务接口
 */
public interface ImageService {

    /**
     * 上传项目图片
     */
    ProjectImage uploadImage(Integer projectId, MultipartFile file);

    /**
     * 批量上传图片
     */
    List<ProjectImage> uploadImages(Integer projectId, List<MultipartFile> files);

    /**
     * 获取项目的所有图片
     */
    List<ProjectImage> getImagesByProject(Integer projectId);

    /**
     * 根据 ID 获取图片
     */
    ProjectImage getImageById(Integer id);

    /**
     * 删除图片
     */
    boolean deleteImage(Integer id);

    /**
     * 设置封面图
     */
    void setAsCover(Integer imageId);

    /**
     * 获取图片文件
     */
    byte[] getImageFile(Integer id);

    /**
     * 根据attachmentId获取图片文件（带缓存）
     */
    byte[] getImageFileByAttachmentId(Integer attachmentId);

    /**
     * 获取缩略图文件
     */
    byte[] getThumbnailFile(Integer id);

    /**
     * 根据attachmentId获取缩略图文件（带缓存）
     */
    byte[] getThumbnailFileByAttachmentId(Integer attachmentId);

    /**
     * 获取图片总数
     */
    Long getTotalImageCount();

    /**
     * 删除项目的所有图片
     */
    void deleteImagesByProject(Integer projectId);

    /**
     * 批量更新图片排序
     */
    void updateImageSortOrder(List<ImageSortDTO> sortList);

    /**
     * 临时上传图片（用于新建项目前）
     * 返回临时图片 ID 列表，创建项目时传入这些 ID 进行关联
     */
    List<Integer> uploadTempImages(List<MultipartFile> files);

    /**
     * 将临时图片关联到项目
     */
    void associateImagesToProject(Integer projectId, List<Integer> imageIds);
}
