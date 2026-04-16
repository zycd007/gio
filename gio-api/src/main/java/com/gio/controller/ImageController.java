package com.gio.controller;

import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

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
    public ResponseEntity<byte[]> getImageFileCompat(@PathVariable Integer imageId, HttpServletResponse response) {
        return getImageFile(imageId, response);
    }

    /**
     * 获取图片文件（C端）
     */
    @GetMapping("/images/{imageId}/file")
    public ResponseEntity<byte[]> getImageFile(@PathVariable Integer imageId, HttpServletResponse response) {
        ProjectImage image = imageService.getImageById(imageId);
        if (image == null || image.getAttachmentId() == null) {
            return ResponseEntity.notFound().build();
        }

        // 使用带缓存的方法
        byte[] imageData = imageService.getImageFileByAttachmentId(image.getAttachmentId());
        if (imageData == null) {
            return ResponseEntity.notFound().build();
        }

        // 设置缓存头 - 24小时，immutable表示内容永不变
        response.setHeader("Cache-Control", "public, max-age=86400, immutable");

        HttpHeaders headers = new HttpHeaders();
        String contentType = getContentType(image.getImageType());
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(imageData.length);
        String encodedFilename = URLEncoder.encode(image.getImageName(), StandardCharsets.UTF_8).replace("+", "%20");
        headers.setContentDispositionFormData("attachment", encodedFilename);

        return ResponseEntity.ok().headers(headers).body(imageData);
    }

    /**
     * 获取图片缩略图（C端）
     */
    @GetMapping("/images/{imageId}/thumbnail")
    public ResponseEntity<byte[]> getThumbnailFile(@PathVariable Integer imageId, HttpServletResponse response) {
        ProjectImage image = imageService.getImageById(imageId);
        if (image == null || image.getAttachmentId() == null) {
            return ResponseEntity.notFound().build();
        }

        // 使用带缓存的方法，直接传入attachmentId避免重复查询
        byte[] thumbnailData = imageService.getThumbnailFileByAttachmentId(image.getAttachmentId());
        if (thumbnailData == null) {
            return ResponseEntity.notFound().build();
        }

        // 直接设置缓存头到 response
        response.setHeader("Cache-Control", "public, max-age=3600");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("image/jpeg"));
        headers.setContentLength(thumbnailData.length);
        headers.setContentDispositionFormData("attachment", "thumbnail.jpg");

        return ResponseEntity.ok().headers(headers).body(thumbnailData);
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