package com.gio.controller;

import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

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
    public ResponseEntity<byte[]> getImageFileCompat(@PathVariable Integer imageId,
                                                     @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
                                                     @RequestHeader(value = HttpHeaders.ACCEPT, required = false) String accept,
                                                     @RequestParam(required = false) String format,
                                                     @RequestParam(required = false) Integer width,
                                                     HttpServletResponse response) {
        return getImageFile(imageId, ifNoneMatch, accept, format, width, response);
    }

    /**
     * 获取图片文件（C端）
     */
    @GetMapping("/images/{imageId}/file")
    public ResponseEntity<byte[]> getImageFile(@PathVariable Integer imageId,
                                               @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
                                               @RequestHeader(value = HttpHeaders.ACCEPT, required = false) String accept,
                                               @RequestParam(required = false) String format,
                                               @RequestParam(required = false) Integer width,
                                               HttpServletResponse response) {
        ProjectImage image = imageService.getImageById(imageId);
        if (image == null || image.getAttachmentId() == null) {
            return ResponseEntity.notFound().build();
        }

        // 确定输出格式
        String outputFormat = "jpg";
        if ("webp".equalsIgnoreCase(format) || (accept != null && accept.contains("image/webp"))) {
            outputFormat = "webp";
        }

        // 获取图片：有width参数则返回调整尺寸后的图片
        byte[] imageData;
        if (width != null && width > 0) {
            imageData = imageService.getResizedImage(imageId, width, outputFormat);
        } else {
            imageData = "webp".equals(outputFormat)
                ? imageService.getImageFileWithFormat(imageId, "webp")
                : imageService.getImageFileByAttachmentId(image.getAttachmentId());
        }

        if (imageData == null) {
            return ResponseEntity.notFound().build();
        }

        // 生成ETag，包含width参数
        String eTag = Integer.toHexString(Arrays.hashCode(imageData)) + "-" + outputFormat + (width != null ? "-" + width : "");

        // 检查If-None-Match
        if (eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
        }

        // 设置缓存头 - 24小时，immutable表示内容永不变
        response.setHeader("Cache-Control", "public, max-age=86400, immutable");
        response.setHeader(HttpHeaders.ETAG, eTag);
        response.setHeader("Vary", "Accept");

        HttpHeaders headers = new HttpHeaders();
        String contentType = "webp".equals(outputFormat) ? "image/webp" : getContentType(image.getImageType());
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(imageData.length);
        String filename = image.getImageName().replaceAll("\\.[^.]+$", "." + outputFormat);
        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
        headers.setContentDispositionFormData("attachment", encodedFilename);

        return ResponseEntity.ok().headers(headers).body(imageData);
    }

    /**
     * 获取图片缩略图（C端）
     */
    @GetMapping("/images/{imageId}/thumbnail")
    public ResponseEntity<byte[]> getThumbnailFile(@PathVariable Integer imageId,
                                                   @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
                                                   @RequestHeader(value = HttpHeaders.ACCEPT, required = false) String accept,
                                                   @RequestParam(required = false) String format,
                                                   HttpServletResponse response) {
        ProjectImage image = imageService.getImageById(imageId);
        if (image == null || image.getAttachmentId() == null) {
            return ResponseEntity.notFound().build();
        }

        // 确定输出格式
        String outputFormat = "jpg";
        if ("webp".equalsIgnoreCase(format) || (accept != null && accept.contains("image/webp"))) {
            outputFormat = "webp";
        }

        // 获取指定格式的缩略图
        byte[] thumbnailData = "webp".equals(outputFormat)
            ? imageService.getThumbnailFileWithFormat(imageId, "webp")
            : imageService.getThumbnailFileByAttachmentId(image.getAttachmentId());

        if (thumbnailData == null) {
            return ResponseEntity.notFound().build();
        }

        // 生成ETag
        String eTag = Integer.toHexString(Arrays.hashCode(thumbnailData)) + "-" + outputFormat + "-thumb";

        // 检查If-None-Match
        if (eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
        }

        // 直接设置缓存头到 response
        response.setHeader("Cache-Control", "public, max-age=3600");
        response.setHeader(HttpHeaders.ETAG, eTag);
        response.setHeader("Vary", "Accept");

        HttpHeaders headers = new HttpHeaders();
        String contentType = "webp".equals(outputFormat) ? "image/webp" : "image/jpeg";
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(thumbnailData.length);
        headers.setContentDispositionFormData("attachment", "thumbnail." + outputFormat);

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