package com.gio.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gio.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 管理员 Mapper 接口
 */
@Mapper
public interface AdminUserMapper extends BaseMapper<AdminUser> {

}
