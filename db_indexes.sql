-- 图片查询性能优化 - 数据库索引添加
-- 执行时间: 2026-04-16
-- 注意: 在低峰期执行，索引会增加写入开销但图片写入频率低

-- project_image 表索引（项目图片列表查询）
-- 查询场景: SELECT * FROM project_image WHERE project_id=? AND status=1 ORDER BY sort_order
CREATE INDEX IF NOT EXISTS idx_project_status ON project_image(project_id, status);

-- attachment 表索引（关联查询）
-- 查询场景: SELECT * FROM attachment WHERE business_type=? AND business_id=?
CREATE INDEX IF NOT EXISTS idx_business_type_id ON attachment(business_type, business_id);

-- project 表索引（分类筛选查询）
-- 查询场景: SELECT * FROM project WHERE category_id=? AND status=?
CREATE INDEX IF NOT EXISTS idx_category_id ON project(category_id);
CREATE INDEX IF NOT EXISTS idx_status_featured ON project(status, is_featured);