package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.entity.Message;
import com.gio.mapper.MessageMapper;
import com.gio.service.EmailService;
import com.gio.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 留言服务实现
 */
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

    @Autowired
    private EmailService emailService;

    @Override
    public boolean submitMessage(Message message) {
        // 设置默认状态为未处理
        message.setStatus(0);
        boolean success = this.save(message);

        // 发送邮件通知
        if (success) {
            logger.info("开始发送邮件通知, message: {}", message);
            emailService.sendNewMessageNotification(message);
        }

        return success;
    }
}