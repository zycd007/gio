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

/**
 * 图片服务实现
 */
@Service
public class ImageServiceImpl implements ImageService {

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
}
