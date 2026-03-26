package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.entity.Message;
import com.gio.mapper.MessageMapper;
import com.gio.service.EmailService;
import com.gio.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 留言服务实现
 */
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Autowired
    private EmailService emailService;

    @Override
    public boolean submitMessage(Message message) {
        // 设置默认状态为未处理
        message.setStatus(0);
        boolean success = this.save(message);

        // 发送邮件通知
        if (success) {
            emailService.sendNewMessageNotification(message);
        }

        return success;
    }
}