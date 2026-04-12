package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.ImageSortDTO;
import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
     * 上传项目图片（支持临时上传，projectId 为空时返回临时图片 ID 列表）
     */
    @PostMapping("/projects/{projectId}/images")
    public Result<List<ProjectImage>> uploadImages(
            @PathVariable Integer projectId,
            @RequestParam("files") List<MultipartFile> files) {
        List<ProjectImage> images = imageService.uploadImages(projectId, files);
        return Result.success(images);
    }

    /**
     * 临时上传图片（用于新建项目前）
     * 返回临时图片 ID 列表，创建项目时传入这些 ID 进行关联
     */
    @PostMapping("/images/temp")
    public Result<List<Integer>> uploadTempImages(
            @RequestParam("files") List<MultipartFile> files) {
        List<Integer> tempImageIds = imageService.uploadTempImages(files);
        return Result.success(tempImageIds);
    }

    /**
     * 将临时图片关联到项目
     */
    @PostMapping("/projects/{projectId}/images/associate")
    public Result<Void> associateImages(
            @PathVariable Integer projectId,
            @RequestBody java.util.Map<String, java.util.List<Integer>> request) {
        java.util.List<Integer> imageIds = request.get("imageIds");
        if (imageIds != null && !imageIds.isEmpty()) {
            imageService.associateImagesToProject(projectId, imageIds);
        }
        return Result.success();
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
     * 批量更新图片排序
     */
    @PutMapping("/projects/{projectId}/images/sort")
    public Result<Void> updateImageSortOrder(
            @PathVariable Integer projectId,
            @RequestBody List<ImageSortDTO> sortList) {
        imageService.updateImageSortOrder(sortList);
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
        String encodedFilename = URLEncoder.encode(image.getImageName(), StandardCharsets.UTF_8).replace("+", "%20");
        headers.setContentDispositionFormData("attachment", encodedFilename);

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
