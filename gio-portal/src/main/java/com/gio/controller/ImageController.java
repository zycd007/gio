package com.gio.controller;

import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * C 端 - 图片接口
 */
@RestController
@RequestMapping("/api")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * 获取图片文件（C端）- 兼容前端旧路径
     */
    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> getImageFileCompat(@PathVariable Integer imageId) {
        return getImageFile(imageId);
    }

    /**
     * 获取图片文件（C端）
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
        if (imageType == null) return "image/jpeg";
        switch (imageType.toLowerCase()) {
            case "png": return "image/png";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            default: return "image/jpeg";
        }
    }
}