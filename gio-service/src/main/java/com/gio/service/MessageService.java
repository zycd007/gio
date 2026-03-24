package com.gio.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gio.entity.Message;

/**
 * 留言服务接口
 */
public interface MessageService extends IService<Message> {

    /**
     * 提交留言
     */
    boolean submitMessage(Message message);
}