package com.gio.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import java.util.Base64;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.gio.common.exception.BusinessException;
import com.gio.dto.ImageSortDTO;
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
import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;

import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 图片服务实现
 */
@Service
public class ImageServiceImpl implements ImageService {

    // 缩略图缓存（最大 2000 个，24 小时过期）
    private final Cache<Integer, byte[]> thumbnailCache = Caffeine.newBuilder()
            .maximumSize(2000)
            .expireAfterWrite(24, TimeUnit.HOURS)
            .recordStats()
            .build();
    // 原图缓存（最大 1000 个，12 小时过期）
    private final Cache<Integer, byte[]> imageCache = Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(12, TimeUnit.HOURS)
            .recordStats()
            .build();
    // WebP格式缩略图缓存
    private final Cache<Integer, byte[]> webpThumbnailCache = Caffeine.newBuilder()
            .maximumSize(2000)
            .expireAfterWrite(24, TimeUnit.HOURS)
            .recordStats()
            .build();
    // WebP格式原图缓存
    private final Cache<Integer, byte[]> webpImageCache = Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(12, TimeUnit.HOURS)
            .recordStats()
            .build();
    // 调整尺寸后的图片缓存，key格式：attachmentId:width:format
    private final Cache<String, byte[]> resizedImageCache = Caffeine.newBuilder()
            .maximumSize(2000)
            .expireAfterWrite(24, TimeUnit.HOURS)
            .recordStats()
            .build();

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
            throw new BusinessException("图片上传失败：" + e.getMessage());
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
        byte[] cached = imageCache.getIfPresent(attachmentId);
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
        byte[] cached = thumbnailCache.getIfPresent(attachmentId);
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

    @Override
    public byte[] getImageFileWithFormat(Integer id, String format) {
        ProjectImage image = getImageById(id);
        if (image == null || image.getAttachmentId() == null) {
            return null;
        }

        if ("webp".equalsIgnoreCase(format)) {
            // 先查WebP缓存
            byte[] cached = webpImageCache.getIfPresent(image.getAttachmentId());
            if (cached != null) {
                return cached;
            }

            // 获取原始图片数据
            byte[] originalData = getImageFileByAttachmentId(image.getAttachmentId());
            if (originalData == null) {
                return null;
            }

            // 转换为WebP格式
            try {
                Path tempFile = Files.createTempFile("webp_", ".tmp");
                Files.write(tempFile, originalData);
                byte[] webpData = compressImage(tempFile, "webp");
                Files.deleteIfExists(tempFile);

                // 存入缓存
                webpImageCache.put(image.getAttachmentId(), webpData);
                return webpData;
            } catch (Exception e) {
                // 转换失败返回原始格式
                return originalData;
            }
        }

        // 默认返回原始格式
        return getImageFileByAttachmentId(image.getAttachmentId());
    }

    @Override
    public byte[] getThumbnailFileWithFormat(Integer id, String format) {
        ProjectImage image = getImageById(id);
        if (image == null || image.getAttachmentId() == null) {
            return null;
        }

        if ("webp".equalsIgnoreCase(format)) {
            // 先查WebP缓存
            byte[] cached = webpThumbnailCache.getIfPresent(image.getAttachmentId());
            if (cached != null) {
                return cached;
            }

            // 获取原始缩略图数据
            byte[] originalData = getThumbnailFileByAttachmentId(image.getAttachmentId());
            if (originalData == null) {
                return null;
            }

            // 转换为WebP格式
            try {
                byte[] webpData = generateThumbnail(originalData, "webp");
                // 存入缓存
                webpThumbnailCache.put(image.getAttachmentId(), webpData);
                return webpData;
            } catch (Exception e) {
                // 转换失败返回原始格式
                return originalData;
            }
        }

        // 默认返回原始格式
        return getThumbnailFileByAttachmentId(image.getAttachmentId());
    }

    @Override
    public byte[] getResizedImage(Integer id, Integer width, String format) {
        ProjectImage image = getImageById(id);
        if (image == null || image.getAttachmentId() == null || width == null || width <= 0) {
            return null;
        }

        // 限制最大宽度为原图宽度
        int targetWidth = Math.min(width, image.getWidth() != null ? image.getWidth() : 1920);
        // 限制最小宽度为100px
        targetWidth = Math.max(targetWidth, 100);

        // 缓存key
        String cacheKey = String.format("%d:%d:%s", image.getAttachmentId(), targetWidth, format.toLowerCase());

        // 先查缓存
        byte[] cached = resizedImageCache.getIfPresent(cacheKey);
        if (cached != null) {
            return cached;
        }

        // 获取原始图片数据
        byte[] originalData = getImageFileByAttachmentId(image.getAttachmentId());
        if (originalData == null) {
            return null;
        }

        // 调整尺寸
        try {
            // 写入临时文件
            Path tempFile = Files.createTempFile("resized_", ".tmp");
            Files.write(tempFile, originalData);

            // 压缩调整尺寸
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Thumbnails.of(tempFile.toFile())
                    .width(targetWidth)
                    .outputQuality(0.8)
                    .outputFormat(format.toLowerCase())
                    .toOutputStream(baos);

            byte[] resizedData = baos.toByteArray();
            Files.deleteIfExists(tempFile);

            // 存入缓存
            resizedImageCache.put(cacheKey, resizedData);
            return resizedData;
        } catch (Exception e) {
            // 调整失败返回原始图片
            return originalData;
        }
    }

    /**
     * 压缩图片
     */
    private byte[] compressImage(Path imagePath) throws IOException {
        return compressImage(imagePath, "jpg");
    }

    /**
     * 压缩图片，指定输出格式
     */
    private byte[] compressImage(Path imagePath, String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(imagePath.toFile())
                .width(1920) // 最大宽度 1920
                .outputQuality(0.8) // 详情图质量0.8
                .outputFormat(format)
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
     * 临时文件清理机制：使用 try-finally 确保临时文件在使用后被删除，
     * 避免文件系统积累无用文件。临时文件在 finally 块中通过 Files.deleteIfExists() 清理。
     */
    private byte[] generateThumbnail(byte[] imageData) throws IOException {
        return generateThumbnail(imageData, "jpg");
    }

    /**
     * 生成缩略图，指定输出格式
     */
    private byte[] generateThumbnail(byte[] imageData, String format) throws IOException {
        // 将 byte 数组转为临时文件
        Path tempFile = Files.createTempFile("thumb_", "." + format);
        try {
            Files.write(tempFile, imageData);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Thumbnails.of(tempFile.toFile())
                    .width(400) // 缩略图宽度 400px
                    .outputQuality(0.6) // 缩略图质量0.6
                    .outputFormat(format)
                    .toOutputStream(baos);
            return baos.toByteArray();
        } finally {
            // 临时文件清理：确保使用完毕后立即删除
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

    @Override
    public void updateImageSortOrder(List<ImageSortDTO> sortList) {
        if (sortList == null || sortList.isEmpty()) {
            return;
        }
        for (ImageSortDTO dto : sortList) {
            ProjectImage image = projectImageMapper.selectById(dto.getImageId());
            if (image != null) {
                image.setSortOrder(dto.getSortOrder());
                projectImageMapper.updateById(image);
            }
        }
    }

    @Override
    public List<Integer> uploadTempImages(List<MultipartFile> files) {
        List<Integer> tempImageIds = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                Integer tempImageId = uploadTempImage(file);
                tempImageIds.add(tempImageId);
            }
        }
        return tempImageIds;
    }

    /**
     * 临时上传图片（project_id 为 null）
     */
    private Integer uploadTempImage(MultipartFile file) {
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

            // 保存到 project_image 表，project_id 为 null
            ProjectImage projectImage = new ProjectImage();
            projectImage.setProjectId(null); // 临时图片，不关联项目
            projectImage.setImageName(originalFilename);
            projectImage.setAttachmentId(null);
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

            // 保存到 attachment 表
            Attachment attachment = new Attachment();
            attachment.setBusinessType("temp_image");
            attachment.setBusinessId(projectImage.getId());
            attachment.setFileName(originalFilename);
            attachment.setFileType(extension.replace(".", ""));
            attachment.setFileSize((int) file.getSize());
            attachment.setBase64Data(Base64.getEncoder().encodeToString(file.getBytes()));
            attachment.setWidth(dimensions[0]);
            attachment.setHeight(dimensions[1]);
            attachment.setThumbnailData(Base64.getEncoder().encodeToString(thumbnailData));
            attachment.setThumbnailWidth(thumbnailDims[0]);
            attachment.setThumbnailHeight(thumbnailDims[1]);
            attachmentMapper.insert(attachment);

            // 更新 project_image 的 attachment_id
            projectImage.setAttachmentId(attachment.getId());
            projectImageMapper.updateById(projectImage);

            return projectImage.getId();
        } catch (IOException e) {
            throw new BusinessException("图片上传失败：" + e.getMessage());
        }
    }

    @Override
    public void associateImagesToProject(Integer projectId, List<Integer> imageIds) {
        if (imageIds == null || imageIds.isEmpty()) {
            return;
        }
        boolean isFirst = true;
        for (Integer imageId : imageIds) {
            ProjectImage image = projectImageMapper.selectById(imageId);
            if (image != null && image.getProjectId() == null) {
                image.setProjectId(projectId);
                // 设置排序，追加到项目现有图片之后
                var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProjectImage>();
                queryWrapper.eq("project_id", projectId).orderByDesc("sort_order").last("limit 1");
                ProjectImage lastImage = projectImageMapper.selectOne(queryWrapper);
                image.setSortOrder(lastImage != null ? lastImage.getSortOrder() + 1 : 0);

                // 第一张图片设为封面
                if (isFirst) {
                    // 先取消项目其他图片的封面
                    var updateWrapper = new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<ProjectImage>();
                    updateWrapper.eq("project_id", projectId).set("is_cover", 0);
                    projectImageMapper.update(null, updateWrapper);

                    image.setIsCover(1);

                    // 更新项目的封面 ID
                    var projectUpdateWrapper = new com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper<com.gio.entity.Project>();
                    projectUpdateWrapper.eq("id", projectId).set("cover_image_id", imageId);
                    projectMapper.update(null, projectUpdateWrapper);

                    isFirst = false;
                }

                projectImageMapper.updateById(image);
            }
        }
    }

    /**
     * 服务完全启动后预加载所有图片缓存，彻底解决冷启动问题
     * 等待Spring容器、数据库连接池全部初始化完成后才开始加载
     */
    @EventListener(ApplicationReadyEvent.class)
    @Async
    public void preloadImageCache() {
        try {
            // 等待3秒确保所有组件完全就绪
            Thread.sleep(3000);

            // 查询所有未删除的图片，优先加载封面图片，然后按上传时间倒序
            var queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ProjectImage>();
            queryWrapper.eq("status", 1)
                    .orderByDesc("is_cover") // 封面图片优先加载
                    .orderByDesc("id");      // 最新上传的优先加载
            List<ProjectImage> allImages = projectImageMapper.selectList(queryWrapper);

            int total = allImages.size();
            int thumbnailCount = 0;
            int coverImageCount = 0;
            int progress = 0;

            System.out.println("🚀 开始预加载所有图片缓存，总图片数：" + total + " 张");

            for (ProjectImage image : allImages) {
                try {
                    if (image.getAttachmentId() != null) {
                        // 1. 预加载所有图片的缩略图（体积小，优先全部加载）
                        byte[] thumbData = getThumbnailFileByAttachmentId(image.getAttachmentId());
                        if (thumbData != null) {
                            thumbnailCount++;
                        }

                        // 2. 预加载所有封面图片的原图（首屏主要用这些）
                        if (image.getIsCover() == 1) {
                            byte[] imageData = getImageFileByAttachmentId(image.getAttachmentId());
                            if (imageData != null) {
                                coverImageCount++;
                            }
                        }
                    }
                } catch (Exception e) {
                    // 单张图片加载失败不影响整体流程
                    System.err.println("警告：图片ID " + image.getId() + " 预加载失败，跳过：" + e.getMessage());
                }

                // 每加载100张打印一次进度
                progress++;
                if (progress % 100 == 0) {
                    double percent = (double) progress / total * 100;
                    System.out.printf("图片预加载进度：%d/%d (%.1f%%)%n", progress, total, percent);
                }
            }

            System.out.println("✅ 图片缓存预加载全部完成：");
            System.out.println("   - 缩略图：" + thumbnailCount + " 张");
            System.out.println("   - 封面原图：" + coverImageCount + " 张");
            System.out.println("   - 所有图片首次访问无延迟！");
        } catch (Exception e) {
            System.err.println("❌ 图片缓存预加载失败：" + e.getMessage());
            // 预加载失败不影响服务正常运行，只是首次访问会稍慢
        }
    }
}
