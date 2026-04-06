package com.gio.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gio.common.Result;
import com.gio.entity.Message;
import com.gio.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 后台管理 - 留言管理
 */
@RestController
@RequestMapping("/api/admin/messages")
public class AdminMessageController {

    @Autowired
    private MessageService messageService;

    /**
     * 获取留言列表（分页）
     */
    @GetMapping
    public Result<Page<Message>> getMessages(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        // 构建查询条件
        LambdaQueryWrapper<Message> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(Message::getCreatedAt);

        // 状态筛选
        if (status != null) {
            queryWrapper.eq(Message::getStatus, status);
        }

        // 分页查询
        Page<Message> pageResult = messageService.page(new Page<>(page, size), queryWrapper);
        return Result.success(pageResult);
    }

    /**
     * 获取留言详情
     */
    @GetMapping("/{id}")
    public Result<Message> getMessage(@PathVariable Integer id) {
        Message message = messageService.getById(id);
        if (message == null) {
            return Result.error(404, "留言不存在");
        }
        return Result.success(message);
    }

    /**
     * 更新留言状态（标记为已处理/未处理）
     */
    @PutMapping("/{id}/status")
    public Result<Void> updateMessageStatus(@PathVariable Integer id, @RequestParam Integer status) {
        Message message = new Message();
        message.setId(id);
        message.setStatus(status);
        boolean success = messageService.updateById(message);
        if (!success) {
            return Result.error(404, "留言不存在");
        }
        return Result.success();
    }

    /**
     * 删除留言
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteMessage(@PathVariable Integer id) {
        boolean success = messageService.removeById(id);
        if (!success) {
            return Result.error(404, "留言不存在");
        }
        return Result.success();
    }

    /**
     * 清空所有留言
     */
    @DeleteMapping
    public Result<Void> clearAllMessages() {
        messageService.remove(new LambdaQueryWrapper<>());
        return Result.success();
    }
}