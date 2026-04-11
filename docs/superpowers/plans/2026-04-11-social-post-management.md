# 小红书推文管理中心 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建小红书推文管理中心，实现 AI 智能生成推文、推文管理、发布辅助功能

**Architecture:** 后端新增 SocialPost 实体和服务层，调用通义千问 API 生成内容；前端新增推文管理页面和生成弹窗组件，集成到现有后台管理系统

**Tech Stack:** Spring Boot 3.2 + MyBatis-Plus 3.5.5 + React 18 + TypeScript + Tailwind CSS + 通义千问 qwen3.5-plus

---

## 文件结构映射

### 新建文件
```
gio-api/src/main/java/com/gio/
├── entity/SocialPost.java              # 推文实体
├── dto/
│   ├── SocialPostGenerateRequest.java  # 生成请求DTO
│   ├── SocialPostDTO.java              # 推文详情DTO
│   └── SocialPostListItemDTO.java      # 列表项DTO
├── mapper/SocialPostMapper.java        # Mapper接口
├── service/
│   ├── SocialPostService.java          # 服务接口
│   └── impl/SocialPostServiceImpl.java # 服务实现（含AI调用）
└── controller/SocialPostController.java # 控制器

gio-web/src/
├── admin/
│   ├── SocialPosts.tsx                 # 推文列表页
│   ├── SocialPostDetail.tsx            # 推文详情页
│   └── components/
│       └── GeneratePostModal.tsx       # 生成推文弹窗
├── services/socialPost.ts              # API服务
└── types/socialPost.ts                 # 类型定义
```

### 需修改文件
| 文件 | 修改内容 |
|------|----------|
| `gio-web/src/admin/Layout.tsx` | 添加"推文管理"菜单项和路由 |
| `gio-web/src/App.tsx` | 添加推文管理路由 |

---

## Task 1: 创建数据库表

**Files:**
- N/A（直接执行SQL）

- [ ] **Step 1: 执行建表SQL**

连接腾讯云数据库执行以下SQL：

```sql
CREATE TABLE social_post (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    
    -- 内容来源
    type VARCHAR(20) NOT NULL COMMENT '类型: project/custom',
    project_id INT NULL COMMENT '关联项目ID',
    
    -- AI生成内容
    title VARCHAR(100) NOT NULL COMMENT '推文标题',
    content TEXT NOT NULL COMMENT '推文正文',
    tags VARCHAR(500) COMMENT '标签（逗号分隔）',
    
    -- 图片选择
    selected_images JSON COMMENT '选中的项目图片ID列表',
    custom_images JSON COMMENT '自定义上传的图片信息',
    
    -- 状态管理
    status TINYINT DEFAULT 0 COMMENT '状态: 0-草稿 1-已发布',
    publish_platform VARCHAR(50) COMMENT '发布平台',
    publish_url VARCHAR(255) COMMENT '发布后的链接',
    
    -- 时间字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    
    INDEX idx_project_id (project_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) COMMENT '小红书推文记录表';
```

**验证命令:**
```bash
# 连接数据库验证表已创建
mysql -h 140.143.87.54 -u root -p'@Yuku007@' gio_design -e "SHOW TABLES LIKE 'social_post';"
```

---

## Task 2: 创建后端实体类

**Files:**
- Create: `gio-api/src/main/java/com/gio/entity/SocialPost.java`

- [ ] **Step 1: 创建 SocialPost 实体类**

```java
package com.gio.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 小红书推文实体类
 */
@Data
@TableName("social_post")
public class SocialPost {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 类型: project/custom
     */
    private String type;

    /**
     * 关联项目ID（type=project时）
     */
    private Integer projectId;

    /**
     * 推文标题
     */
    private String title;

    /**
     * 推文正文
     */
    private String content;

    /**
     * 标签（逗号分隔）
     */
    private String tags;

    /**
     * 选中的项目图片ID列表（JSON数组）
     */
    private String selectedImages;

    /**
     * 自定义上传的图片信息（JSON数组）
     */
    private String customImages;

    /**
     * 状态: 0-草稿 1-已发布
     */
    private Integer status;

    /**
     * 发布平台
     */
    private String publishPlatform;

    /**
     * 发布后的链接
     */
    private String publishUrl;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除: 0-未删除 1-已删除
     */
    private Integer deleted;
}
```

---

## Task 3: 创建 DTO 类

**Files:**
- Create: `gio-api/src/main/java/com/gio/dto/SocialPostGenerateRequest.java`
- Create: `gio-api/src/main/java/com/gio/dto/SocialPostDTO.java`
- Create: `gio-api/src/main/java/com/gio/dto/SocialPostListItemDTO.java`

- [ ] **Step 1: 创建生成请求DTO**

```java
package com.gio.dto;

import lombok.Data;
import java.util.List;

/**
 * 生成推文请求DTO
 */
@Data
public class SocialPostGenerateRequest {
    
    /**
     * 类型: project 或 custom
     */
    private String type;
    
    /**
     * 项目ID（type=project时必填）
     */
    private Integer projectId;
    
    /**
     * 选中的项目图片ID列表
     */
    private List<Integer> selectedImageIds;
    
    /**
     * 自定义内容描述（type=custom时必填）
     */
    private String customContent;
    
    /**
     * 自定义图片附件ID列表
     */
    private List<Integer> customImageIds;
}
```

- [ ] **Step 2: 创建推文详情DTO**

```java
package com.gio.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 推文详情DTO
 */
@Data
public class SocialPostDTO {
    
    private Integer id;
    private String type;
    private Integer projectId;
    private String projectName;
    private String title;
    private String content;
    private String tags;
    private List<Integer> selectedImages;
    private Integer status;
    private String publishPlatform;
    private String publishUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

- [ ] **Step 3: 创建列表项DTO**

```java
package com.gio.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 推文列表项DTO
 */
@Data
public class SocialPostListItemDTO {
    
    private Integer id;
    private String type;
    private Integer projectId;
    private String projectName;
    private String title;
    private Integer status;
    private LocalDateTime createdAt;
}
```

---

## Task 4: 创建 Mapper 接口

**Files:**
- Create: `gio-api/src/main/java/com/gio/mapper/SocialPostMapper.java`

- [ ] **Step 1: 创建 Mapper 接口**

```java
package com.gio.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gio.entity.SocialPost;
import org.apache.ibatis.annotations.Mapper;

/**
 * 小红书推文Mapper
 */
@Mapper
public interface SocialPostMapper extends BaseMapper<SocialPost> {
}
```

---

## Task 5: 创建服务接口

**Files:**
- Create: `gio-api/src/main/java/com/gio/service/SocialPostService.java`

- [ ] **Step 1: 创建服务接口**

```java
package com.gio.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gio.dto.PageResult;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.entity.SocialPost;

/**
 * 小红书推文服务接口
 */
public interface SocialPostService extends IService<SocialPost> {
    
    /**
     * 生成推文（AI）
     */
    SocialPostDTO generatePost(SocialPostGenerateRequest request);
    
    /**
     * 分页获取推文列表
     */
    PageResult<SocialPostListItemDTO> getPostList(Integer page, Integer size, String type, Integer status, String keyword);
    
    /**
     * 获取推文详情
     */
    SocialPostDTO getPostDetail(Integer id);
    
    /**
     * 更新推文内容
     */
    SocialPostDTO updatePost(Integer id, SocialPostDTO dto);
    
    /**
     * 删除推文
     */
    boolean deletePost(Integer id);
    
    /**
     * 更新发布状态
     */
    boolean updatePublishStatus(Integer id, Integer status, String platform, String url);
}
```

---

## Task 6: 创建服务实现类

**Files:**
- Create: `gio-api/src/main/java/com/gio/service/impl/SocialPostServiceImpl.java`

- [ ] **Step 1: 创建服务实现类（核心逻辑）**

```java
package com.gio.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gio.dto.*;
import com.gio.entity.Project;
import com.gio.entity.ProjectImage;
import com.gio.entity.SocialPost;
import com.gio.mapper.SocialPostMapper;
import com.gio.service.ProjectService;
import com.gio.service.SocialPostService;
import com.gio.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 小红书推文服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SocialPostServiceImpl extends ServiceImpl<SocialPostMapper, SocialPost> implements SocialPostService {
    
    @Value("${ai.dashscope.api-key}")
    private String apiKey;
    
    @Value("${ai.dashscope.base-url}")
    private String baseUrl;
    
    @Value("${ai.dashscope.model}")
    private String model;
    
    private final ProjectService projectService;
    private final ImageService imageService;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Override
    public SocialPostDTO generatePost(SocialPostGenerateRequest request) {
        String prompt;
        List<Integer> imageIds = new ArrayList<>();
        
        if ("project".equals(request.getType())) {
            // 从项目生成
            ProjectDetailDTO project = projectService.getProjectDetail(request.getProjectId());
            prompt = buildProjectPrompt(project);
            imageIds = request.getSelectedImageIds() != null ? request.getSelectedImageIds() : new ArrayList<>();
        } else {
            // 自定义生成
            prompt = buildCustomPrompt(request.getCustomContent());
        }
        
        // 调用AI生成
        String aiResponse = callQwenAPI(prompt);
        SocialPostDTO dto = parseAIResponse(aiResponse);
        
        // 保存到数据库
        SocialPost post = new SocialPost();
        post.setType(request.getType());
        post.setProjectId(request.getProjectId());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setTags(dto.getTags());
        post.setStatus(0); // 草稿状态
        
        try {
            post.setSelectedImages(objectMapper.writeValueAsString(imageIds));
        } catch (JsonProcessingException e) {
            log.error("序列化图片ID失败", e);
        }
        
        save(post);
        
        dto.setId(post.getId());
        dto.setType(post.getType());
        dto.setProjectId(post.getProjectId());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        
        return dto;
    }
    
    private String buildProjectPrompt(ProjectDetailDTO project) {
        return String.format("""
            你是一个专业的照明设计品牌营销专家。
            请根据以下项目信息，生成一篇小红书推文。
            
            【项目信息】
            项目名称：%s
            项目位置：%s
            设计年份：%s
            项目描述：%s
            分类：%s
            
            【要求】
            1. 标题：吸引眼球，15-25字，可使用emoji，突出灯光设计特色
            2. 正文：300-500字，第一人称视角，专业但不生硬，展现公司理念和能力
            3. 标签：5-8个，包含行业词+场景词+风格词，用逗号分隔
            4. 目标受众：潜在客户（业主、商业空间负责人）和行业从业者
            5. 调性：专业有感染力，温暖而不生硬
            
            请严格按照以下格式输出：
            【标题】你的标题内容
            【正文】你的正文内容
            【标签】标签1,标签2,标签3
            """,
            project.getName(),
            project.getLocation() != null ? project.getLocation() : "未知",
            project.getYear() != null ? project.getYear() : "未知",
            project.getDescription() != null ? project.getDescription() : "暂无描述",
            project.getCategoryName() != null ? project.getCategoryName() : "照明设计"
        );
    }
    
    private String buildCustomPrompt(String customContent) {
        return String.format("""
            你是一个专业的照明设计品牌营销专家。
            请根据以下内容描述，生成一篇小红书推文。
            
            【内容描述】
            %s
            
            【要求】
            1. 标题：吸引眼球，15-25字，可使用emoji
            2. 正文：300-500字，第一人称视角，专业但不生硬
            3. 标签：5-8个，包含行业词+场景词+风格词，用逗号分隔
            4. 目标受众：潜在客户和行业从业者
            5. 调性：专业有感染力
            
            请严格按照以下格式输出：
            【标题】你的标题内容
            【正文】你的正文内容
            【标签】标签1,标签2,标签3
            """, customContent);
    }
    
    private String callQwenAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("input", Map.of("prompt", prompt));
            requestBody.put("parameters", Map.of(
                "max_tokens", 1000,
                "temperature", 0.7,
                "result_format", "text"
            ));
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(baseUrl + "/services/aigc/text-generation/generation", entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> output = (Map<String, Object>) response.getBody().get("output");
                return (String) output.get("text");
            }
            
            throw new RuntimeException("AI调用失败");
        } catch (Exception e) {
            log.error("调用通义千问API失败", e);
            throw new RuntimeException("AI生成失败: " + e.getMessage());
        }
    }
    
    private SocialPostDTO parseAIResponse(String response) {
        SocialPostDTO dto = new SocialPostDTO();
        
        try {
            // 解析标题
            int titleStart = response.indexOf("【标题】");
            int titleEnd = response.indexOf("【正文】");
            if (titleStart != -1 && titleEnd != -1) {
                dto.setTitle(response.substring(titleStart + 4, titleEnd).trim());
            }
            
            // 解析正文
            int contentStart = response.indexOf("【正文】");
            int contentEnd = response.indexOf("【标签】");
            if (contentStart != -1 && contentEnd != -1) {
                dto.setContent(response.substring(contentStart + 4, contentEnd).trim());
            }
            
            // 解析标签
            int tagsStart = response.indexOf("【标签】");
            if (tagsStart != -1) {
                String tagsStr = response.substring(tagsStart + 4).trim();
                // 清理标签格式
                tagsStr = tagsStr.replaceAll("[\\n\\r]", "");
                dto.setTags(tagsStr);
            }
            
            // 如果解析失败，使用默认值
            if (dto.getTitle() == null || dto.getTitle().isEmpty()) {
                dto.setTitle("✨ 照明设计作品分享");
            }
            if (dto.getContent() == null || dto.getContent().isEmpty()) {
                dto.setContent(response);
            }
            if (dto.getTags() == null || dto.getTags().isEmpty()) {
                dto.setTags("照明设计,室内灯光,氛围感");
            }
        } catch (Exception e) {
            log.error("解析AI响应失败", e);
            dto.setTitle("✨ 照明设计作品分享");
            dto.setContent(response);
            dto.setTags("照明设计,室内灯光,氛围感");
        }
        
        return dto;
    }
    
    @Override
    public PageResult<SocialPostListItemDTO> getPostList(Integer page, Integer size, String type, Integer status, String keyword) {
        LambdaQueryWrapper<SocialPost> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SocialPost::getDeleted, 0);
        
        if (type != null && !type.isEmpty()) {
            wrapper.eq(SocialPost::getType, type);
        }
        if (status != null) {
            wrapper.eq(SocialPost::getStatus, status);
        }
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(SocialPost::getTitle, keyword);
        }
        
        wrapper.orderByDesc(SocialPost::getCreatedAt);
        
        Page<SocialPost> pageResult = page(new Page<>(page, size), wrapper);
        
        List<SocialPostListItemDTO> list = pageResult.getRecords().stream()
            .map(this::convertToListItemDTO)
            .collect(Collectors.toList());
        
        return new PageResult<>(list, pageResult.getTotal(), page, size);
    }
    
    private SocialPostListItemDTO convertToListItemDTO(SocialPost post) {
        SocialPostListItemDTO dto = new SocialPostListItemDTO();
        dto.setId(post.getId());
        dto.setType(post.getType());
        dto.setProjectId(post.getProjectId());
        dto.setTitle(post.getTitle());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        
        // 获取项目名称
        if (post.getProjectId() != null) {
            Project project = projectService.getById(post.getProjectId());
            if (project != null) {
                dto.setProjectName(project.getName());
            }
        }
        
        return dto;
    }
    
    @Override
    public SocialPostDTO getPostDetail(Integer id) {
        SocialPost post = getById(id);
        if (post == null || post.getDeleted() == 1) {
            throw new RuntimeException("推文不存在");
        }
        
        SocialPostDTO dto = new SocialPostDTO();
        dto.setId(post.getId());
        dto.setType(post.getType());
        dto.setProjectId(post.getProjectId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setTags(post.getTags());
        dto.setStatus(post.getStatus());
        dto.setPublishPlatform(post.getPublishPlatform());
        dto.setPublishUrl(post.getPublishUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        // 解析图片ID列表
        try {
            if (post.getSelectedImages() != null && !post.getSelectedImages().isEmpty()) {
                dto.setSelectedImages(objectMapper.readValue(post.getSelectedImages(), List.class));
            }
        } catch (JsonProcessingException e) {
            log.error("解析图片ID失败", e);
        }
        
        // 获取项目名称
        if (post.getProjectId() != null) {
            Project project = projectService.getById(post.getProjectId());
            if (project != null) {
                dto.setProjectName(project.getName());
            }
        }
        
        return dto;
    }
    
    @Override
    public SocialPostDTO updatePost(Integer id, SocialPostDTO dto) {
        SocialPost post = getById(id);
        if (post == null || post.getDeleted() == 1) {
            throw new RuntimeException("推文不存在");
        }
        
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setTags(dto.getTags());
        
        if (dto.getSelectedImages() != null) {
            try {
                post.setSelectedImages(objectMapper.writeValueAsString(dto.getSelectedImages()));
            } catch (JsonProcessingException e) {
                log.error("序列化图片ID失败", e);
            }
        }
        
        updateById(post);
        return getPostDetail(id);
    }
    
    @Override
    public boolean deletePost(Integer id) {
        SocialPost post = getById(id);
        if (post == null) {
            return false;
        }
        post.setDeleted(1);
        return updateById(post);
    }
    
    @Override
    public boolean updatePublishStatus(Integer id, Integer status, String platform, String url) {
        SocialPost post = getById(id);
        if (post == null) {
            return false;
        }
        post.setStatus(status);
        post.setPublishPlatform(platform);
        post.setPublishUrl(url);
        return updateById(post);
    }
}
```

---

## Task 7: 创建控制器

**Files:**
- Create: `gio-api/src/main/java/com/gio/controller/SocialPostController.java`

- [ ] **Step 1: 创建控制器**

```java
package com.gio.controller;

import com.gio.dto.PageResult;
import com.gio.dto.Result;
import com.gio.dto.SocialPostDTO;
import com.gio.dto.SocialPostGenerateRequest;
import com.gio.dto.SocialPostListItemDTO;
import com.gio.service.SocialPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 小红书推文管理控制器
 */
@RestController
@RequestMapping("/api/admin/social-posts")
@RequiredArgsConstructor
public class SocialPostController {
    
    private final SocialPostService socialPostService;
    
    /**
     * 生成推文（AI）
     */
    @PostMapping("/generate")
    public Result<SocialPostDTO> generatePost(@Valid @RequestBody SocialPostGenerateRequest request) {
        SocialPostDTO dto = socialPostService.generatePost(request);
        return Result.success(dto);
    }
    
    /**
     * 获取推文列表
     */
    @GetMapping
    public Result<PageResult<SocialPostListItemDTO>> getPostList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        PageResult<SocialPostListItemDTO> result = socialPostService.getPostList(page, size, type, status, keyword);
        return Result.success(result);
    }
    
    /**
     * 获取推文详情
     */
    @GetMapping("/{id}")
    public Result<SocialPostDTO> getPostDetail(@PathVariable Integer id) {
        SocialPostDTO dto = socialPostService.getPostDetail(id);
        return Result.success(dto);
    }
    
    /**
     * 更新推文
     */
    @PutMapping("/{id}")
    public Result<SocialPostDTO> updatePost(@PathVariable Integer id, @RequestBody SocialPostDTO dto) {
        SocialPostDTO updated = socialPostService.updatePost(id, dto);
        return Result.success(updated);
    }
    
    /**
     * 删除推文
     */
    @DeleteMapping("/{id}")
    public Result<Void> deletePost(@PathVariable Integer id) {
        socialPostService.deletePost(id);
        return Result.success();
    }
    
    /**
     * 更新发布状态
     */
    @PutMapping("/{id}/publish")
    public Result<Void> updatePublishStatus(
            @PathVariable Integer id,
            @RequestParam Integer status,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String url) {
        socialPostService.updatePublishStatus(id, status, platform, url);
        return Result.success();
    }
}
```

---

## Task 8: 创建前端类型定义

**Files:**
- Create: `gio-web/src/types/socialPost.ts`

- [ ] **Step 1: 创建类型定义**

```typescript
// 推文类型
export interface SocialPost {
  id: number;
  type: 'project' | 'custom';
  projectId?: number;
  projectName?: string;
  title: string;
  content: string;
  tags: string;
  selectedImages?: number[];
  status: number; // 0-草稿 1-已发布
  publishPlatform?: string;
  publishUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// 列表项类型
export interface SocialPostListItem {
  id: number;
  type: 'project' | 'custom';
  projectId?: number;
  projectName?: string;
  title: string;
  status: number;
  createdAt: string;
}

// 生成请求类型
export interface SocialPostGenerateRequest {
  type: 'project' | 'custom';
  projectId?: number;
  selectedImageIds?: number[];
  customContent?: string;
  customImageIds?: number[];
}

// 分页结果类型
export interface SocialPostListResult {
  list: SocialPostListItem[];
  total: number;
  page: number;
  size: number;
}
```

---

## Task 9: 创建前端 API 服务

**Files:**
- Create: `gio-web/src/services/socialPost.ts`

- [ ] **Step 1: 创建 API 服务**

```typescript
import request from './api';
import { SocialPost, SocialPostListItem, SocialPostGenerateRequest, SocialPostListResult } from '../types/socialPost';

/**
 * 生成推文（AI）
 */
export const generatePost = (data: SocialPostGenerateRequest): Promise<SocialPost> => {
  return request.post('/admin/social-posts/generate', data);
};

/**
 * 获取推文列表
 */
export const getPostList = (
  page: number = 1,
  size: number = 10,
  type?: string,
  status?: number,
  keyword?: string
): Promise<SocialPostListResult> => {
  return request.get('/admin/social-posts', {
    params: { page, size, type, status, keyword }
  });
};

/**
 * 获取推文详情
 */
export const getPostDetail = (id: number): Promise<SocialPost> => {
  return request.get(`/admin/social-posts/${id}`);
};

/**
 * 更新推文
 */
export const updatePost = (id: number, data: Partial<SocialPost>): Promise<SocialPost> => {
  return request.put(`/admin/social-posts/${id}`, data);
};

/**
 * 删除推文
 */
export const deletePost = (id: number): Promise<void> => {
  return request.delete(`/admin/social-posts/${id}`);
};

/**
 * 更新发布状态
 */
export const updatePublishStatus = (
  id: number,
  status: number,
  platform?: string,
  url?: string
): Promise<void> => {
  return request.put(`/admin/social-posts/${id}/publish`, null, {
    params: { status, platform, url }
  });
};
```

---

## Task 10: 修改 Layout.tsx 添加菜单项

**Files:**
- Modify: `gio-web/src/admin/Layout.tsx`

- [ ] **Step 1: 添加面包屑配置**

在 `breadcrumbMap` 对象中添加推文管理配置：

```typescript
// 面包屑配置
const breadcrumbMap: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/messages': '客户留言',
  '/admin/projects': '项目管理',
  '/admin/categories': '分类管理',
  '/admin/social-posts': '推文管理',  // 新增
};
```

- [ ] **Step 2: 添加 NavLink 组件**

在导航菜单中添加推文管理链接（约第100行之后）：

```tsx
<NavLink to="/admin/social-posts" icon="edit" collapsed={sidebarCollapsed} active={location.pathname.startsWith('/admin/social-posts')}>
  推文管理
</NavLink>
```

- [ ] **Step 3: 添加 edit 图标定义**

在 `NavLink` 组件的 `icons` 对象中已有 `edit` 图标，无需修改。

---

## Task 11: 修改 App.tsx 添加路由

**Files:**
- Modify: `gio-web/src/App.tsx`

- [ ] **Step 1: 导入推文管理组件**

在文件顶部添加导入：

```typescript
import AdminSocialPosts from './admin/SocialPosts';
import SocialPostDetail from './admin/SocialPostDetail';
```

- [ ] **Step 2: 添加路由配置**

在 `<Route path="/admin">` 内添加推文管理路由：

```tsx
<Route path="social-posts" element={<AdminSocialPosts />} />
<Route path="social-posts/:id" element={<SocialPostDetail />} />
```

---

## Task 12: 创建推文列表页

**Files:**
- Create: `gio-web/src/admin/SocialPosts.tsx`

- [ ] **Step 1: 创建推文列表页组件**

```tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getPostList, deletePost, updatePublishStatus } from '../services/socialPost';
import { SocialPostListItem, SocialPostListResult } from '../types/socialPost';
import GeneratePostModal from './components/GeneratePostModal';

const SocialPosts = () => {
  const [posts, setPosts] = useState<SocialPostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  
  // 筛选条件
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>();
  const [keyword, setKeyword] = useState('');
  
  // 生成弹窗
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const result = await getPostList(page, size, filterType, filterStatus, keyword);
      setPosts(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('获取推文列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, size, filterType, filterStatus]);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条推文吗？')) return;
    try {
      await deletePost(id);
      toast.success('删除成功');
      fetchPosts();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleMarkPublished = async (id: number) => {
    try {
      await updatePublishStatus(id, 1, 'xiaohongshu');
      toast.success('已标记为发布');
      fetchPosts();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // 统计数据
  const stats = {
    total,
    project: posts.filter(p => p.type === 'project').length,
    custom: posts.filter(p => p.type === 'custom').length,
    published: posts.filter(p => p.status === 1).length,
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部操作栏 */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">推文管理</h1>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            生成新推文
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-4 py-3 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="text-sm text-slate-500">总计</div>
          <div className="text-xl font-semibold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="text-sm text-slate-500">项目源</div>
          <div className="text-xl font-semibold text-emerald-600">{stats.project}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="text-sm text-slate-500">自定义</div>
          <div className="text-xl font-semibold text-blue-600">{stats.custom}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="text-sm text-slate-500">已发布</div>
          <div className="text-xl font-semibold text-orange-600">{stats.published}</div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="px-4 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:border-emerald-400 focus:outline-none"
          >
            <option value="">全部类型</option>
            <option value="project">项目生成</option>
            <option value="custom">自定义内容</option>
          </select>
          <select
            value={filterStatus ?? ''}
            onChange={(e) => setFilterStatus(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:border-emerald-400 focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="0">草稿</option>
            <option value="1">已发布</option>
          </select>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索标题..."
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:border-emerald-400 focus:outline-none"
          />
          <button
            onClick={fetchPosts}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 推文列表 */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>暂无推文，点击上方按钮生成第一条推文</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">来源</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.type === 'project' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {post.type === 'project' ? '项目' : '自定义'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{post.projectName || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 1 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {post.status === 1 ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/social-posts/${post.id}`}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          详情
                        </Link>
                        {post.status === 0 && (
                          <button
                            onClick={() => handleMarkPublished(post.id)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            标记发布
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 分页 */}
      {total > size && (
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              上一页
            </button>
            <span className="text-sm text-slate-600">
              第 {page} / {Math.ceil(total / size)} 页
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / size)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 生成弹窗 */}
      {showGenerateModal && (
        <GeneratePostModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
};

export default SocialPosts;
```

---

## Task 13: 创建生成推文弹窗组件

**Files:**
- Create: `gio-web/src/admin/components/GeneratePostModal.tsx`

- [ ] **Step 1: 创建生成推文弹窗**

```tsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generatePost } from '../../services/socialPost';
import { getProjects, getProjectImages, ProjectDetail, ProjectImage } from '../../services/admin';

interface GeneratePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const GeneratePostModal = ({ onClose, onSuccess }: GeneratePostModalProps) => {
  const [step, setStep] = useState<'source' | 'select' | 'generating' | 'result'>('source');
  const [type, setType] = useState<'project' | 'custom'>('project');
  
  // 项目模式数据
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  
  // 自定义模式数据
  const [customContent, setCustomContent] = useState('');
  
  // 生成结果
  const [generatedPost, setGeneratedPost] = useState<any>(null);

  useEffect(() => {
    // 加载项目列表
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await getProjects(1, 100, undefined, undefined, undefined, 1); // 只获取已发布项目
      // 转换为 ProjectDetail 格式（简化处理）
      setProjects(result.list.map((p: any) => ({ id: p.id, name: p.name })));
    } catch (error) {
      toast.error('加载项目列表失败');
    }
  };

  const handleSelectProject = async (projectId: number) => {
    setSelectedProjectId(projectId);
    try {
      const images = await getProjectImages(projectId);
      setProjectImages(images);
      // 默认选择前3张图片
      setSelectedImageIds(images.slice(0, 3).map(img => img.id));
    } catch (error) {
      toast.error('加载项目图片失败');
    }
    setStep('select');
  };

  const handleImageToggle = (imageId: number) => {
    setSelectedImageIds(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleGenerate = async () => {
    if (type === 'project' && !selectedProjectId) {
      toast.error('请先选择项目');
      return;
    }
    if (type === 'custom' && !customContent.trim()) {
      toast.error('请输入内容描述');
      return;
    }

    setStep('generating');
    try {
      const result = await generatePost({
        type,
        projectId: selectedProjectId,
        selectedImageIds,
        customContent,
      });
      setGeneratedPost(result);
      setStep('result');
    } catch (error) {
      toast.error('生成失败，请重试');
      setStep('select');
    }
  };

  const handleCopyContent = () => {
    const text = `${generatedPost.title}\n\n${generatedPost.content}\n\n#${generatedPost.tags}`;
    navigator.clipboard.writeText(text);
    toast.success('文案已复制，去小红书发布吧！');
  };

  const handleSaveAndClose = () => {
    toast.success('推文已保存');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {step === 'source' && '生成小红书推文'}
            {step === 'select' && (type === 'project' ? '从项目生成' : '自定义内容')}
            {step === 'generating' && '正在生成...'}
            {step === 'result' && '生成成功'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-auto">
          {/* Step 1: 选择来源 */}
          {step === 'source' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">请选择内容来源：</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setType('project'); }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    type === 'project' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📂</div>
                  <div className="font-medium text-slate-800">从项目生成</div>
                  <div className="text-sm text-slate-500 mt-1">选择已有项目，自动提取信息</div>
                </button>
                <button
                  onClick={() => { setType('custom'); setStep('select'); }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    type === 'custom' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-medium text-slate-800">自定义内容</div>
                  <div className="text-sm text-slate-500 mt-1">输入描述，自由创作</div>
                </button>
              </div>
              {type === 'project' && (
                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-2">选择项目：</p>
                  <div className="grid grid-cols-3 gap-3 max-h-40 overflow-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project.id)}
                        className="p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                      >
                        <div className="text-sm font-medium text-slate-800 truncate">{project.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: 选择详情 */}
          {step === 'select' && type === 'project' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-600 mb-2">选择图片（最多9张）：</div>
              <div className="grid grid-cols-5 gap-3">
                {projectImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageToggle(image.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIds.includes(image.id)
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={`/api/images/${image.attachmentId}`}
                      alt="项目图片"
                      className="w-full h-20 object-cover"
                    />
                    {selectedImageIds.includes(image.id) && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'select' && type === 'custom' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-600 mb-2">输入内容描述：</div>
              <textarea
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="例如：分享照明设计的5个常见误区..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:border-emerald-400 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Step 3: 生成中 */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">AI 正在生成推文内容...</p>
            </div>
          )}

          {/* Step 4: 生成结果 */}
          {step === 'result' && generatedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>生成成功！</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-500">标题</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-800">{generatedPost.title}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-500">正文</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-800 whitespace-pre-wrap">{generatedPost.content}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-500">标签</label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-slate-600">{generatedPost.tags}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          {step !== 'source' && step !== 'generating' && step !== 'result' && (
            <button
              onClick={() => setStep('source')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              上一步
            </button>
          )}
          {step === 'result' && (
            <button
              onClick={handleCopyContent}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              📋 复制文案
            </button>
          )}
          <div className="flex items-center gap-2">
            {step === 'select' && (
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                生成推文
              </button>
            )}
            {step === 'result' && (
              <button
                onClick={handleSaveAndClose}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                保存并关闭
              </button>
            )}
            {step !== 'result' && step !== 'generating' && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePostModal;
```

---

## Task 14: 创建推文详情页

**Files:**
- Create: `gio-web/src/admin/SocialPostDetail.tsx`

- [ ] **Step 1: 创建推文详情页**

```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getPostDetail, updatePost, deletePost, updatePublishStatus } from '../services/socialPost';
import { getProjectImages, ProjectImage } from '../services/admin';
import { SocialPost } from '../types/socialPost';

const SocialPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<SocialPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // 编辑表单
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  
  // 图片列表
  const [images, setImages] = useState<ProjectImage[]>([]);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await getPostDetail(Number(id));
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditTags(data.tags);
      
      // 加载项目图片
      if (data.projectId && data.selectedImages?.length > 0) {
        const projectImages = await getProjectImages(data.projectId);
        setImages(projectImages.filter(img => data.selectedImages?.includes(img.id)));
      }
    } catch (error) {
      toast.error('加载推文详情失败');
      navigate('/admin/social-posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!post) return;
    try {
      await updatePost(post.id, {
        title: editTitle,
        content: editContent,
        tags: editTags,
      });
      toast.success('保存成功');
      setEditing(false);
      loadPost();
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm('确定要删除这条推文吗？')) return;
    try {
      await deletePost(post.id);
      toast.success('删除成功');
      navigate('/admin/social-posts');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleCopyContent = () => {
    if (!post) return;
    const text = `${post.title}\n\n${post.content}\n\n#${post.tags}`;
    navigator.clipboard.writeText(text);
    toast.success('文案已复制');
  };

  const handleMarkPublished = async () => {
    if (!post) return;
    try {
      await updatePublishStatus(post.id, 1, 'xiaohongshu');
      toast.success('已标记为发布');
      loadPost();
    } catch (error) {
      toast.error('操作失败');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部导航 */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/social-posts" className="text-slate-500 hover:text-slate-700">
              ← 返回列表
            </Link>
            <h1 className="text-lg font-semibold text-slate-800">推文详情</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${
              post.status === 1 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {post.status === 1 ? '已发布' : '草稿'}
            </span>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 来源信息 */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">来源信息</div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-xs ${
                post.type === 'project' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {post.type === 'project' ? '项目生成' : '自定义内容'}
              </span>
              {post.projectName && (
                <span className="text-sm text-slate-600">项目：{post.projectName}</span>
              )}
            </div>
          </div>

          {/* 标题 */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-500">标题</label>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-sm text-emerald-600 hover:text-emerald-700">
                  编辑
                </button>
              )}
            </div>
            {editing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-400 focus:outline-none"
              />
            ) : (
              <div className="text-slate-800">{post.title}</div>
            )}
          </div>

          {/* 正文 */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">正文</div>
            {editing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-48 p-2 border border-slate-300 rounded-lg focus:border-emerald-400 focus:outline-none resize-none"
              />
            ) : (
              <div className="text-slate-800 whitespace-pre-wrap">{post.content}</div>
            )}
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-500 mb-2">标签</div>
            {editing ? (
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:border-emerald-400 focus:outline-none"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 图片预览 */}
          {images.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-500 mb-2">图片预览</div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((image) => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden">
                    <img
                      src={`/api/images/${image.attachmentId}`}
                      alt="推文图片"
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 发布辅助 */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="text-sm text-slate-500 mb-3">发布辅助</div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyContent}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                📋 一键复制文案
              </button>
              {post.status === 0 && (
                <button
                  onClick={handleMarkPublished}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  标记为已发布
                </button>
              )}
            </div>
            {post.publishUrl && (
              <div className="mt-4 text-sm text-slate-600">
                发布链接：<a href={post.publishUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{post.publishUrl}</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                取消编辑
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                保存修改
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-500 hover:text-red-600"
            >
              删除推文
            </button>
          )}
          <div className="text-sm text-slate-400">
            创建于 {new Date(post.createdAt).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPostDetail;
```

---

## Task 15: 编译验证

**Files:**
- N/A

- [ ] **Step 1: 编译后端项目**

```bash
cd gio-api
mvn clean compile -DskipTests
```

**预期结果**: 编译成功，无错误

- [ ] **Step 2: 编译前端项目**

```bash
cd gio-web
pnpm install
pnpm build
```

**预期结果**: 编译成功，无错误

- [ ] **Step 3: 启动后端服务并测试API**

```bash
cd gio-api
mvn spring-boot:run
```

测试生成推文接口：
```bash
curl -X POST http://localhost:8081/api/admin/social-posts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"project","projectId":1}'
```

**预期结果**: 返回生成的推文内容

---

## Task 16: 提交代码

**Files:**
- N/A

- [ ] **Step 1: 添加所有新文件到Git**

```bash
git add gio-api/src/main/java/com/gio/entity/SocialPost.java
git add gio-api/src/main/java/com/gio/dto/SocialPost*.java
git add gio-api/src/main/java/com/gio/mapper/SocialPostMapper.java
git add gio-api/src/main/java/com/gio/service/SocialPost*.java
git add gio-api/src/main/java/com/gio/controller/SocialPostController.java
git add gio-web/src/admin/SocialPosts.tsx
git add gio-web/src/admin/SocialPostDetail.tsx
git add gio-web/src/admin/components/GeneratePostModal.tsx
git add gio-web/src/services/socialPost.ts
git add gio-web/src/types/socialPost.ts
git add docs/superpowers/specs/2026-04-11-social-post-management-design.md
git add docs/superpowers/plans/2026-04-11-social-post-management.md
```

- [ ] **Step 2: 提交代码**

```bash
git commit -m "$(cat <<'EOF'
feat: 新增小红书推文管理中心

- 新增 SocialPost 实体和数据库表
- 实现通义千问 AI 推文生成功能
- 支持项目模式和自定义模式两种内容来源
- 新增推文列表页和详情页
- 实现一键复制文案发布辅助功能
- 推文历史管理（保存、编辑、删除）

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review 检查清单

**1. Spec Coverage（规范覆盖检查）**
- ✅ 数据库表创建 - Task 1
- ✅ 后端实体和DTO - Task 2, 3
- ✅ Mapper和服务层 - Task 4, 5, 6
- ✅ 控制器API - Task 7
- ✅ 前端类型和API服务 - Task 8, 9
- ✅ 菜单和路由集成 - Task 10, 11
- ✅ 推文列表页 - Task 12
- ✅ 生成弹窗组件 - Task 13
- ✅ 推文详情页 - Task 14
- ✅ 编译验证 - Task 15
- ✅ Git提交 - Task 16

**2. Placeholder Scan（占位符检查）**
- ✅ 无 "TBD" 或 "TODO"
- ✅ 所有代码块包含完整实现
- ✅ 无模糊描述

**3. Type Consistency（类型一致性检查）**
- ✅ SocialPost 实体字段与 DTO 一致
- ✅ API 请求/响应类型与前端类型匹配
- ✅ 服务方法签名与接口定义一致