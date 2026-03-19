package com.gio.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import com.gio.entity.ProjectImage;
import com.gio.mapper.ProjectImageMapper;
import com.gio.mapper.ProjectMapper;
import com.gio.service.ImageService;
import net.coobird.thumbnailator.Thumbnails;
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

    public ImageServiceImpl(ProjectImageMapper projectImageMapper, ProjectMapper projectMapper) {
        this.projectImageMapper = projectImageMapper;
        this.projectMapper = projectMapper;
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

            // 保存到数据库
            ProjectImage projectImage = new ProjectImage();
            projectImage.setProjectId(projectId);
            projectImage.setImageName(originalFilename);
            projectImage.setImagePath("/uploads/" + fileName);
            projectImage.setImageType(extension.replace(".", ""));
            projectImage.setFileSize((int) file.getSize());
            projectImage.setWidth(dimensions[0]);
            projectImage.setHeight(dimensions[1]);
            projectImage.setIsCover(0);
            projectImage.setSortOrder(0);
            projectImage.setStatus(1);

            projectImageMapper.insert(projectImage);
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
            // 删除文件
            String filePath = image.getImagePath().replace("/uploads/", uploadPath);
            FileUtil.del(filePath);
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
        if (image == null || image.getImagePath() == null) {
            return null;
        }
        try {
            String filePath = image.getImagePath().startsWith("/")
                    ? image.getImagePath().substring(1)
                    : image.getImagePath();
            return Files.readAllBytes(Paths.get(filePath));
        } catch (IOException e) {
            return null;
        }
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
}
