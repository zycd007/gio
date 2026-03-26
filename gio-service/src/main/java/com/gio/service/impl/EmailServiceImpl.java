package com.gio.service.impl;

import com.gio.entity.Message;
import com.gio.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * 邮件服务实现
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${notification.admin-email:}")
    private String adminEmail;

    @Override
    public void sendNewMessageNotification(Message message) {
        if (adminEmail == null || adminEmail.isEmpty() || "".equals(adminEmail)) {
            logger.warn("管理员邮箱未配置，跳过邮件通知");
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(adminEmail);
            mailMessage.setSubject("【GIO官网】新的客户留言提醒");

            String content = String.format(
                "您有一条新的客户留言：\n\n" +
                "姓名：%s\n" +
                "联系方式：%s\n" +
                "留言内容：%s\n" +
                "提交时间：%s\n\n" +
                "请及时登录后台处理。",
                message.getName() != null ? message.getName() : "未填写",
                message.getPhone() != null ? message.getPhone() : "未填写",
                message.getContent() != null ? message.getContent() : "未填写",
                message.getCreatedAt() != null ? message.getCreatedAt().toString() : ""
            );

            mailMessage.setText(content);
            mailSender.send(mailMessage);

            logger.info("新留言通知邮件已发送至: {}", adminEmail);
        } catch (Exception e) {
            logger.error("发送留言通知邮件失败: {}", e.getMessage());
        }
    }
}