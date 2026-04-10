-- AI 推文表
CREATE TABLE IF NOT EXISTS `ai_copywriting` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `project_id` INT DEFAULT NULL COMMENT '关联项目 ID，自由创作时为 NULL',
  `title` VARCHAR(100) NOT NULL COMMENT '推文标题',
  `content` TEXT NOT NULL COMMENT '推文正文',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签列表，JSON 格式存储',
  `style` VARCHAR(50) NOT NULL COMMENT '文案风格：professional/seed/story/minimal',
  `source_type` TINYINT NOT NULL DEFAULT 1 COMMENT '来源类型：1-项目生成 2-自由创作',
  `custom_images` VARCHAR(1000) DEFAULT NULL COMMENT '自由创作模式下的图片 URL，JSON 数组',
  `custom_description` TEXT DEFAULT NULL COMMENT '自由创作模式下的用户描述',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-草稿 1-已发布',
  `tokens_used` INT DEFAULT NULL COMMENT '消耗 Token 数',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除：0-未删除 1-已删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_project (`project_id`),
  INDEX idx_status (`status`),
  INDEX idx_created (`created_at`),
  INDEX idx_deleted (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI 推文表';

-- 项目表添加字段：是否有 AI 推文
ALTER TABLE `project` ADD COLUMN `has_copywriting` TINYINT DEFAULT 0 COMMENT '是否有 AI 推文：0-否 1-是';
