package com.gio.service;

import com.gio.dto.AiCopywritingResponse;
import com.gio.dto.CopywritingCreateRequest;
import com.gio.dto.CopywritingDTO;
import com.gio.dto.FreeCopywritingRequest;
import com.gio.dto.PageResult;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * AI 文案生成服务接口
 */
public interface AiCopywritingService {

    /**
     * 生成小红书文案
     *
     * @param projectId 项目 ID
     * @param style 文案风格
     * @return AI 生成的文案
     */
    AiCopywritingResponse generateCopywriting(Integer projectId, String style);

    /**
     * 生成小红书文案（流式输出）
     *
     * @param projectId 项目 ID
     * @param style 文案风格
     * @param emitter SSE 发射器
     */
    void generateCopywritingStream(Integer projectId, String style, SseEmitter emitter);

    /**
     * 自由创作模式 - 生成推文（流式输出）
     *
     * @param request 请求参数（图片 + 描述）
     * @param emitter SSE 发射器
     */
    void generateFreeCopywritingStream(FreeCopywritingRequest request, SseEmitter emitter);

    /**
     * 保存推文
     *
     * @param request 创建请求
     * @return 推文 DTO
     */
    CopywritingDTO saveCopywriting(CopywritingCreateRequest request);

    /**
     * 获取推文列表（分页）
     *
     * @param page 页码
     * @param size 每页数量
     * @param projectId 项目 ID（可选）
     * @param status 状态（可选）
     * @param sourceType 来源类型（可选）
     * @param keyword 搜索关键词（可选）
     * @return 分页结果
     */
    PageResult<CopywritingDTO> getCopywritingList(Integer page, Integer size, Integer projectId,
                                                   Integer status, Integer sourceType, String keyword);

    /**
     * 获取推文详情
     *
     * @param id 推文 ID
     * @return 推文 DTO
     */
    CopywritingDTO getCopywritingDetail(Integer id);

    /**
     * 更新推文
     *
     * @param id 推文 ID
     * @param request 更新请求
     * @return 推文 DTO
     */
    CopywritingDTO updateCopywriting(Integer id, CopywritingCreateRequest request);

    /**
     * 删除推文
     *
     * @param id 推文 ID
     * @return 是否成功
     */
    boolean deleteCopywriting(Integer id);

    /**
     * 重新生成推文
     *
     * @param id 推文 ID
     * @param style 文案风格
     * @param emitter SSE 发射器
     */
    void regenerateCopywritingStream(Integer id, String style, SseEmitter emitter);

    /**
     * 获取项目关联的推文列表
     *
     * @param projectId 项目 ID
     * @return 推文列表
     */
    java.util.List<CopywritingDTO> getProjectCopywritings(Integer projectId);
}
