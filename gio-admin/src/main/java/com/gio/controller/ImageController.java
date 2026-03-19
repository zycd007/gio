package com.gio.controller;

import com.gio.common.Result;
import com.gio.entity.ProjectImage;
import com.gio.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公开接口 - 图片
 */
@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * 获取项目的所有图片
     */
    @GetMapping("/project/{projectId}")
    public Result<List<ProjectImage>> getProjectImages(@PathVariable Integer projectId) {
        List<ProjectImage> images = imageService.getImagesByProject(projectId);
        return Result.success(images);
    }

    /**
     * 获取单张图片（二进制）
     */
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        ProjectImage image = imageService.getImageById(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageData = imageService.getImageFile(id);
        if (imageData == null || imageData.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentLength(imageData.length);

        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }
}
