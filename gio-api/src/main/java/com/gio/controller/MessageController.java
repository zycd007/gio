package com.gio.controller;

import com.gio.common.Result;
import com.gio.entity.Message;
import com.gio.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 留言接口 - 公开展示
 */
@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * 提交留言
     */
    @PostMapping("/messages")
    public Result<?> submitMessage(@RequestBody Message message) {
        // 至少填写一个字段才能提交
        boolean hasName = message.getName() != null && !message.getName().trim().isEmpty();
        boolean hasPhone = message.getPhone() != null && !message.getPhone().trim().isEmpty();
        boolean hasContent = message.getContent() != null && !message.getContent().trim().isEmpty();

        if (!hasName && !hasPhone && !hasContent) {
            return Result.error("请至少填写一项内容");
        }

        boolean success = messageService.submitMessage(message);
        if (success) {
            return Result.success(null);
        } else {
            return Result.error("提交失败，请稍后重试");
        }
    }
}