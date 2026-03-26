package com.gio.service;

import com.gio.entity.Message;

/**
 * 邮件服务接口
 */
public interface EmailService {

    /**
     * 发送新留言通知邮件
     */
    void sendNewMessageNotification(Message message);
}