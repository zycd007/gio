package com.gio.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import java.util.Base64;
import com.gio.entity.Attachment;
import com.gio.entity.ProjectImage;
import com.gio.mapper.AttachmentMapper;
import com.gio.mapper.ProjectImageMapper;
import com.gio.mapper.ProjectMapper;
import com.gio.service.ImageService;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 图片服务实现
 */
@Service
public class ImageServiceImpl implements ImageService {

    // 缩略图缓存
    private final ConcurrentHashMap<Integer, byte[]> thumbnailCache = new ConcurrentHashMap<>();
    // 原图缓存
    private final ConcurrentHashMap<Integer, byte[]> imageCache = new ConcurrentHashMap<>();

    @Value("${file.upload-path}")
    private String uploadPath;

    private final ProjectImageMapper projectImageMapper;
    private final ProjectMapper projectMapper;
    private final AttachmentMapper attachmentMapper;

    @Autowired
    public ImageServiceImpl(ProjectImageMapper projectImageMapper, ProjectMapper projectMapper, AttachmentMapper attachmentMapper) {
        this.projectImageMapper = projectImageMapper;
        this.projectMapper = projectMapper;
        this.attachmentMapper = attachmentMapper;
    }

    @Override
    public ProjectImage uploadImage(Integer projectId, MultipartFile file) {
        try {
            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String fileName = IdUtil.fastSimpleUUID() + extension;

            // 确保上传目录存在
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 保存文件
            Path filePath = Paths.get(uploadPath, fileName);
            Files.write(filePath, file.getBytes());

            // 压缩图片并获取尺寸
            byte[] compressedData = compressImage(filePath);
            int[] dimensions = getImageDimensions(filePath);

            // 先保存到 project_image 表，获取 ID
            ProjectImage projectImage = new ProjectImage();
            projectImage.setProjectId(projectId);
            projectImage.setImageName(originalFilename);
            projectImage.setAttachmentId(null); // 先不设置，等Attachment保存后更新
            projectImage.setImageType(extension.replace(".", ""));
            projectImage.setFileSize((int) file.getSize());
            projectImage.setWidth(dimensions[0]);
            projectImage.setHeight(dimensions[1]);
            projectImage.setIsCover(0);
            projectImage.setSortOrder(0);
            projectImage.setStatus(1);

            projectImageMapper.insert(projectImage);

            // 生成缩略图
            byte[] thumbnailData = generateThumbnail(file.getBytes());
            int[] thumbnailDims = estimateThumbnailDimensions(dimensions[0], dimensions[1], 400);

            // 保存到 attachment 表，关联 project_image
            Attachment attachment = new Attachment();
            attachment.setBusinessType("project_image");
            attachment.setBusinessId(projectImage.getId());
            attachment.setFileName(originalFilename);
            attachment.setFileType(extension.replace(".", ""));
            attachment.setFileSize((int) file.getSize());
            attachment.setBase64Data(Base64.getEncoder().encodeToString(file.getBytes()));
            attachment.setWidth(dimensions[0]);
            attachment.setHeight(dimensions[1]);
            // 保存缩略图
            attachment.setThumbnailData(Base64.getEncoder().encodeToString(thumbnailData));
            attachment.setThumbnailWidth(thumbnailDims[0]);
            attachment.setThumbnailHeight(thumbnailDims[1]);
            attachmentMapper.insert(attachment);

            // 更新 project_image 的 attachment_id
            projectImage.setAttachmentId(attachment.getId());
            projectImageMapper.updateById(projectImage);

            return projectImage;
        } catch (IOException e) {
            throw new RuntimeException("图片上传失败：" + e.getMessage(), e);
        }
    }

    @Override
    public List<ProjectImage> uploadImages(Integer projectId, List<MultipartFile> files) {
        List<ProjectImage> result = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                result.add(uploadImage(projectId, file));
            }
        }
        return result;
    }

    @Override
    public List<ProjectImage> getImagesByProject(Integer projectId) {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProjectImage>();
        queryWrapper.eq("project_id", projectId)
                .eq("status", 1)
                .orderByAsc("sort_order")
                .orderByAsc("id");
        return projectImageMapper.selectList(queryWrapper);
    }

    @Override
    public ProjectImage getImageById(Integer id) {
        return projectImageMapper.selectById(id);
    }

    @Override
    public boolean deleteImage(Integer id) {
        ProjectImage image = projectImageMapper.selectById(id);
        if (image != null) {
            // 通过 attachmentId 删除 attachment 记录
            if (image.getAttachmentId() != null) {
                attachmentMapper.deleteById(image.getAttachmentId());
            }
            // 逻辑删除
            image.setStatus(0);
            projectImageMapper.updateById(image);
            return true;
        }
        return false;
    }

    @Override
    public void setAsCover(Integer imageId) {
        ProjectImage image = projectImageMapper.selectById(imageId);
        if (image != null) {
            // 先将同项目的所有图片取消封面
            var updateWrapper = new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<ProjectImage>();
            updateWrapper.eq("project_id", image.getProjectId())
                    .set("is_cover", 0);
            projectImageMapper.update(null, updateWrapper);

            // 设置当前图片为封面
            image.setIsCover(1);
            projectImageMapper.updateById(image);

            // 更新项目的封面 ID
            var projectUpdateWrapper = new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<com.gio.entity.Project>();
            projectUpdateWrapper.eq("id", image.getProjectId())
                    .set("cover_image_id", imageId);
            projectMapper.update(null, projectUpdateWrapper);
        }
    }

    @Override
    public byte[] getImageFile(Integer id) {
        ProjectImage image = projectImageMapper.selectById(id);
        if (image == null || image.getAttachmentId() == null) {
            return null;
        }
        // 通过 attachmentId 获取图片数据
        Attachment attachment = attachmentMapper.selectById(image.getAttachmentId());
        if (attachment == null) {
            return null;
        }
        // 优先使用 base64Data
        if (attachment.getBase64Data() != null && !attachment.getBase64Data().isEmpty()) {
            return Base64.getDecoder().decode(attachment.getBase64Data());
        }
        // 没有可用的图片数据
        return null;
    }

    @Override
    public byte[] getImageFileByAttachmentId(Integer attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        // 先检查缓存
        byte[] cached = imageCache.get(attachmentId);
        if (cached != null) {
            return cached;
        }

        // 从数据库查询
        Attachment attachment = attachmentMapper.selectById(attachmentId);
        if (attachment == null) {
            return null;
        }

        byte[] imageData = null;
        if (attachment.getBase64Data() != null && !attachment.getBase64Data().isEmpty()) {
            imageData = Base64.getDecoder().decode(attachment.getBase64Data());
        }

        // 存入缓存
        if (imageData != null) {
            imageCache.put(attachmentId, imageData);
        }
        return imageData;
    }

    @Override
    public byte[] getThumbnailFile(Integer id) {
        ProjectImage image = projectImageMapper.selectById(id);
        if (image == null || image.getAttachmentId() == null) {
            return null;
        }
        Attachment attachment = attachmentMapper.selectById(image.getAttachmentId());
        if (attachment == null) {
            return null;
        }
        // 优先使用 thumbnailData
        if (attachment.getThumbnailData() != null && !attachment.getThumbnailData().isEmpty()) {
            return Base64.getDecoder().decode(attachment.getThumbnailData());
        }
        // 如果没有缩略图，尝试生成一个
        if (attachment.getBase64Data() != null && !attachment.getBase64Data().isEmpty()) {
            try {
                byte[] originalData = Base64.getDecoder().decode(attachment.getBase64Data());
                byte[] thumbnailData = generateThumbnail(originalData);
                // 保存生成的缩略图
                attachment.setThumbnailData(Base64.getEncoder().encodeToString(thumbnailData));
                // 估算缩略图尺寸
                int[] dims = estimateThumbnailDimensions(attachment.getWidth(), attachment.getHeight(), 400);
                attachment.setThumbnailWidth(dims[0]);
                attachment.setThumbnailHeight(dims[1]);
                attachmentMapper.updateById(attachment);
                return thumbnailData;
            } catch (Exception e) {
                // 如果生成失败，返回原图
                return Base64.getDecoder().decode(attachment.getBase64Data());
            }
        }
        return null;
    }

    @Override
    public byte[] getThumbnailFileByAttachmentId(Integer attachmentId) {
        if (attachmentId == null) {
            return null;
        }
        // 先检查缓存
        byte[] cached = thumbnailCache.get(attachmentId);
        if (cached != null) {
            return cached;
        }

        // 从数据库查询
        Attachment attachment = attachmentMapper.selectById(attachmentId);
        if (attachment == null) {
            return null;
        }

        byte[] thumbnailData = null;
        // 优先使用 thumbnailData
        if (attachment.getThumbnailData() != null && !attachment.getThumbnailData().isEmpty()) {
            thumbnailData = Base64.getDecoder().decode(attachment.getThumbnailData());
        } else if (attachment.getBase64Data() != null && !attachment.getBase64Data().isEmpty()) {
            // 如果没有缩略图，尝试生成一个
            try {
                byte[] originalData = Base64.getDecoder().decode(attachment.getBase64Data());
                thumbnailData = generateThumbnail(originalData);
                // 保存生成的缩略图
                attachment.setThumbnailData(Base64.getEncoder().encodeToString(thumbnailData));
                // 估算缩略图尺寸
                int[] dims = estimateThumbnailDimensions(attachment.getWidth(), attachment.getHeight(), 400);
                attachment.setThumbnailWidth(dims[0]);
                attachment.setThumbnailHeight(dims[1]);
                attachmentMapper.updateById(attachment);
            } catch (Exception e) {
                // 如果生成失败，返回原图
                thumbnailData = Base64.getDecoder().decode(attachment.getBase64Data());
            }
        }

        // 存入缓存
        if (thumbnailData != null) {
            thumbnailCache.put(attachmentId, thumbnailData);
        }
        return thumbnailData;
    }

    /**
     * 压缩图片
     */
    private byte[] compressImage(Path imagePath) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(imagePath.toFile())
                .width(1920) // 最大宽度 1920
                .outputQuality(0.85)
                .outputFormat("jpg")
                .toOutputStream(baos);
        return baos.toByteArray();
    }

    /**
     * 获取图片尺寸
     */
    private int[] getImageDimensions(Path imagePath) throws IOException {
        var image = ImageIO.read(imagePath.toFile());
        if (image != null) {
            return new int[]{image.getWidth(), image.getHeight()};
        }
        return new int[]{0, 0};
    }

    @Override
    public Long getTotalImageCount() {
        var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProjectImage>();
        queryWrapper.eq("status", 1);
        return projectImageMapper.selectCount(queryWrapper);
    }

    @Override
    public void deleteImagesByProject(Integer projectId) {
        // 获取项目的所有图片
        List<ProjectImage> images = getImagesByProject(projectId);
        for (ProjectImage image : images) {
            // 通过 attachmentId 删除 attachment 记录
            if (image.getAttachmentId() != null) {
                attachmentMapper.deleteById(image.getAttachmentId());
            }
            // 逻辑删除
            image.setStatus(0);
            projectImageMapper.updateById(image);
        }
    }

    /**
     * 生成缩略图
     */
    private byte[] generateThumbnail(byte[] imageData) throws IOException {
        // 将 byte 数组转为临时文件
        Path tempFile = Files.createTempFile("thumb_", ".jpg");
        try {
            Files.write(tempFile, imageData);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Thumbnails.of(tempFile.toFile())
                    .width(400) // 缩略图宽度 400px
                    .outputQuality(0.7) // 质量 0.7
                    .outputFormat("jpg")
                    .toOutputStream(baos);
            return baos.toByteArray();
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }

    /**
     * 估算缩略图尺寸
     */
    private int[] estimateThumbnailDimensions(Integer originalWidth, Integer originalHeight, int targetWidth) {
        if (originalWidth == null || originalHeight == null || originalWidth == 0) {
            return new int[]{targetWidth, targetWidth};
        }
        if (originalWidth <= targetWidth) {
            return new int[]{originalWidth, originalHeight};
        }
        int newHeight = (int) ((double) originalHeight * targetWidth / originalWidth);
        return new int[]{targetWidth, newHeight};
    }
}
