package com.gio.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gio.entity.PageViewLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TrackMapper extends BaseMapper<PageViewLog> {
}
