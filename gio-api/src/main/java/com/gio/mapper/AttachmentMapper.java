package com.gio.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gio.entity.Attachment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 附件 Mapper 接口
 */
@Mapper
public interface AttachmentMapper extends BaseMapper<Attachment> {

    /**
     * 批量查询图片附件（JOIN 查询避免 N+1）
     * @param imageIds 项目图片 ID 列表
     * @return 附件列表
     */
    @Select("SELECT a.* FROM attachment a " +
            "INNER JOIN project_image pi ON a.business_id = pi.id " +
            "WHERE pi.id IN (${imageIds}) AND a.business_type = 'project_image'")
    List<Attachment> selectByProjectImageIds(@Param("imageIds") List<Integer> imageIds);

}