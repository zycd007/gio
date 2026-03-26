-- 数据库迁移：为 project_image 表添加 attachment_id 字段
-- 执行前请备份数据库

-- 1. 添加 attachment_id 字段
ALTER TABLE project_image ADD COLUMN attachment_id INT DEFAULT NULL;

-- 2. 将现有的 image_path 数据迁移到 attachment 表，然后关联
-- 注意：这需要先确保 attachment 表中有对应的记录
-- 如果是全新部署，可以跳过此步骤

-- 3. 设置外键关联（可选）
-- ALTER TABLE project_image ADD FOREIGN KEY (attachment_id) REFERENCES attachment(id);

-- 4. 迁移完成后可以删除 image_path 字段（建议先观察一段时间再删除）
-- ALTER TABLE project_image DROP COLUMN image_path;