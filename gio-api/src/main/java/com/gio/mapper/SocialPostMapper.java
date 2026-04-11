package com.gio.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gio.entity.SocialPost;
import org.apache.ibatis.annotations.Mapper;

/**
 * 小红书推文Mapper
 */
@Mapper
public interface SocialPostMapper extends BaseMapper<SocialPost> {
}
