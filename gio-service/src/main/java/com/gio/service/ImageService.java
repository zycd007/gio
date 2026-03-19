package com.gio.service;

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
}
