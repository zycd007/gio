package com.gio.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gio.entity.Message;
import com.gio.mapper.MessageMapper;
import com.gio.service.MessageService;
import org.springframework.stereotype.Service;

/**
 * 留言服务实现
 */
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Override
    public boolean submitMessage(Message message) {
        // 设置默认状态为未处理
        message.setStatus(0);
        return this.save(message);
    }
}