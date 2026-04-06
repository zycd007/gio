package com.gio.controller;

import com.gio.common.Result;
import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 后台管理 - 图片管理
 */
@RestController
@RequestMapping("/api/admin")
public class AdminImageController {

    @Autowired
    private ImageService imageService;

    /**
     * 上传项目图片
     */
    @PostMapping("/projects/{projectId}/images")
    public Result<List<ProjectImage>> uploadImages(
            @PathVariable Integer projectId,
            @RequestParam("files") List<MultipartFile> files) {
        List<ProjectImage> images = imageService.uploadImages(projectId, files);
        return Result.success(images);
    }

    /**
     * 获取项目图片列表
     */
    @GetMapping("/projects/{projectId}/images")
    public Result<List<ProjectImage>> getProjectImages(@PathVariable Integer projectId) {
        List<ProjectImage> images = imageService.getImagesByProject(projectId);
        return Result.success(images);
    }

    /**
     * 删除图片
     */
    @DeleteMapping("/images/{imageId}")
    public Result<Void> deleteImage(@PathVariable Integer imageId) {
        imageService.deleteImage(imageId);
        return Result.success();
    }

    /**
     * 设置封面图
     */
    @PutMapping("/images/{imageId}/cover")
    public Result<Void> setAsCover(@PathVariable Integer imageId) {
        imageService.setAsCover(imageId);
        return Result.success();
    }

    /**
     * 获取图片文件
     */
    @GetMapping("/images/{imageId}/file")
    public ResponseEntity<byte[]> getImageFile(@PathVariable Integer imageId) {
        ProjectImage image = imageService.getImageById(imageId);
        if (image == null || image.getAttachmentId() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageData = imageService.getImageFile(imageId);
        if (imageData == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        String contentType = getContentType(image.getImageType());
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(imageData.length);
        headers.setContentDispositionFormData("attachment", image.getImageName());

        return ResponseEntity.ok().headers(headers).body(imageData);
    }

    private String getContentType(String imageType) {
        switch (imageType.toLowerCase()) {
            case "png": return "image/png";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            default: return "image/jpeg";
        }
    }
}
