package com.gio.controller;

import com.gio.common.Result;
import com.gio.dto.*;
import com.gio.service.AiCopywritingService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * AI 文案生成与推文管理控制器
 */
@RestController
@RequestMapping("/api/admin")
public class AiCopywritingController {

    private static final Logger logger = LoggerFactory.getLogger(AiCopywritingController.class);

    private final ExecutorService executor = Executors.newCachedThreadPool();

    @Autowired
    private AiCopywritingService aiCopywritingService;

    // ==================== 项目管理中的 AI 文案生成 ====================

    /**
     * 生成小红书文案（流式输出 SSE）- 基于项目
     */
    @PostMapping(value = "/projects/{projectId}/ai-copywriting/stream")
    public SseEmitter generateCopywritingStream(
            @PathVariable Integer projectId,
            @RequestBody AiCopywritingRequest request) {

        logger.info("生成 AI 文案（流式）：projectId={}, style={}", projectId, request.getStyle());

        SseEmitter emitter = new SseEmitter(120000L);

        executor.execute(() -> {
            try {
                aiCopywritingService.generateCopywritingStream(projectId, request.getStyle(), emitter);
            } catch (IllegalArgumentException e) {
                logger.warn("参数错误：{}", e.getMessage());
                try {
                    JSONObject errorJson = new JSONObject();
                    errorJson.put("error", e.getMessage());
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(errorJson.toString()));
                } catch (IOException ex) {
                    // ignore
                }
                emitter.completeWithError(e);
            } catch (Exception e) {
                logger.error("生成 AI 文案失败：projectId={}", projectId, e);
                try {
                    JSONObject errorJson = new JSONObject();
                    errorJson.put("error", e.getMessage());
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(errorJson.toString()));
                } catch (IOException ex) {
                    // ignore
                }
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    /**
     * 生成小红书文案（同步接口）- 基于项目
     */
    @PostMapping("/projects/{projectId}/ai-copywriting")
    public Result<AiCopywritingResponse> generateCopywriting(
            @PathVariable Integer projectId,
            @RequestBody AiCopywritingRequest request) {

        logger.info("生成 AI 文案：projectId={}, style={}", projectId, request.getStyle());

        try {
            AiCopywritingResponse response = aiCopywritingService.generateCopywriting(projectId, request.getStyle());
            return Result.success(response);
        } catch (IllegalArgumentException e) {
            logger.warn("参数错误：{}", e.getMessage());
            return Result.error(400, e.getMessage());
        } catch (RuntimeException e) {
            logger.error("生成 AI 文案失败：projectId={}", projectId, e);
            return Result.error(500, "AI 文案生成失败：" + e.getMessage());
        }
    }

    // ==================== 自由创作模式 ====================

    /**
     * 自由创作 - 生成推文（流式输出 SSE）
     */
    @PostMapping(value = "/copywriting/free/stream")
    public SseEmitter generateFreeCopywritingStream(@RequestBody FreeCopywritingRequest request) {
        logger.info("自由创作 AI 文案（流式）：style={}", request.getStyle());

        SseEmitter emitter = new SseEmitter(120000L);

        executor.execute(() -> {
            try {
                aiCopywritingService.generateFreeCopywritingStream(request, emitter);
            } catch (Exception e) {
                logger.error("自由创作 AI 文案失败", e);
                try {
                    JSONObject errorJson = new JSONObject();
                    errorJson.put("error", e.getMessage());
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(errorJson.toString()));
                } catch (IOException ex) {
                    // ignore
                }
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    // ==================== 推文管理相关接口 ====================

    /**
     * 获取推文列表（分页）
     */
    @GetMapping("/copywritings")
    public Result<PageResult<CopywritingDTO>> getCopywritings(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer projectId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer sourceType,
            @RequestParam(required = false) String keyword) {

        PageResult<CopywritingDTO> result = aiCopywritingService.getCopywritingList(
                page, size, projectId, status, sourceType, keyword);
        return Result.success(result);
    }

    /**
     * 获取推文详情
     */
    @GetMapping("/copywritings/{id}")
    public Result<CopywritingDTO> getCopywriting(@PathVariable Integer id) {
        CopywritingDTO dto = aiCopywritingService.getCopywritingDetail(id);
        if (dto == null) {
            return Result.error(404, "推文不存在");
        }
        return Result.success(dto);
    }

    /**
     * 创建推文
     */
    @PostMapping("/copywritings")
    public Result<CopywritingDTO> createCopywriting(@RequestBody CopywritingCreateRequest request) {
        try {
            CopywritingDTO dto = aiCopywritingService.saveCopywriting(request);
            return Result.success(dto);
        } catch (Exception e) {
            logger.error("创建推文失败", e);
            return Result.error(500, "创建失败：" + e.getMessage());
        }
    }

    /**
     * 更新推文
     */
    @PutMapping("/copywritings/{id}")
    public Result<CopywritingDTO> updateCopywriting(
            @PathVariable Integer id,
            @RequestBody CopywritingCreateRequest request) {
        try {
            CopywritingDTO dto = aiCopywritingService.updateCopywriting(id, request);
            return Result.success(dto);
        } catch (RuntimeException e) {
            logger.error("更新推文失败", e);
            return Result.error(404, e.getMessage());
        } catch (Exception e) {
            logger.error("更新推文失败", e);
            return Result.error(500, "更新失败：" + e.getMessage());
        }
    }

    /**
     * 删除推文
     */
    @DeleteMapping("/copywritings/{id}")
    public Result<Void> deleteCopywriting(@PathVariable Integer id) {
        boolean success = aiCopywritingService.deleteCopywriting(id);
        if (!success) {
            return Result.error(404, "推文不存在");
        }
        return Result.success();
    }

    /**
     * 重新生成推文（流式）
     */
    @PostMapping(value = "/copywritings/{id}/regenerate/stream")
    public SseEmitter regenerateCopywritingStream(
            @PathVariable Integer id,
            @RequestBody AiCopywritingRequest request) {

        logger.info("重新生成推文（流式）：id={}, style={}", id, request.getStyle());

        SseEmitter emitter = new SseEmitter(120000L);

        executor.execute(() -> {
            try {
                aiCopywritingService.regenerateCopywritingStream(id, request.getStyle(), emitter);
            } catch (Exception e) {
                logger.error("重新生成推文失败：id={}", id, e);
                try {
                    JSONObject errorJson = new JSONObject();
                    errorJson.put("error", e.getMessage());
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(errorJson.toString()));
                } catch (IOException ex) {
                    // ignore
                }
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    /**
     * 获取项目关联的推文列表
     */
    @GetMapping("/projects/{projectId}/copywritings")
    public Result<List<CopywritingDTO>> getProjectCopywritings(@PathVariable Integer projectId) {
        List<CopywritingDTO> list = aiCopywritingService.getProjectCopywritings(projectId);
        return Result.success(list);
    }
}
