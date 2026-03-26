SET NAMES utf8mb4;


INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例1', 'China', '2024', '服装买手店 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_1_image1.jpg', '/uploads/projects/p10_1_image1.jpg', 'jpg', 117925, 1920, 931, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例2', 'China', '2024', '服装买手店 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_2_image2.jpg', '/uploads/projects/p10_2_image2.jpg', 'jpg', 59940, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例3', 'China', '2024', '服装买手店 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_3_image3.jpg', '/uploads/projects/p10_3_image3.jpg', 'jpg', 81210, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例4', 'China', '2024', '服装买手店 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_4_image4.jpg', '/uploads/projects/p10_4_image4.jpg', 'jpg', 73219, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例5', 'China', '2024', '服装买手店 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_5_image5.jpg', '/uploads/projects/p10_5_image5.jpg', 'jpg', 66456, 687, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例6', 'China', '2024', '服装买手店 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_6_image6.jpg', '/uploads/projects/p10_6_image6.jpg', 'jpg', 149184, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例7', 'China', '2024', '服装买手店 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_7_image7.jpg', '/uploads/projects/p10_7_image7.jpg', 'jpg', 195587, 1920, 1033, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例1', 'China', '2024', '服装买手店 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_1_image1.jpg', '/uploads/projects/p10_1_image1.jpg', 'jpg', 24243, 459, 688, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例2', 'China', '2024', '服装买手店 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_2_image2.jpg', '/uploads/projects/p10_2_image2.jpg', 'jpg', 34445, 459, 688, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例3', 'China', '2024', '服装买手店 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_3_image3.jpg', '/uploads/projects/p10_3_image3.jpg', 'jpg', 32153, 1030, 686, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例4', 'China', '2024', '服装买手店 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_4_image4.jpg', '/uploads/projects/p10_4_image4.jpg', 'jpg', 89329, 1017, 678, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例5', 'China', '2024', '服装买手店 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_5_image5.jpg', '/uploads/projects/p10_5_image5.jpg', 'jpg', 39807, 1014, 678, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例1', 'China', '2024', '服装买手店 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_1_image1.jpg', '/uploads/projects/p10_1_image1.jpg', 'jpg', 120791, 1080, 718, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例2', 'China', '2024', '服装买手店 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_2_image2.jpg', '/uploads/projects/p10_2_image2.jpg', 'jpg', 123866, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例3', 'China', '2024', '服装买手店 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_3_image3.jpg', '/uploads/projects/p10_3_image3.jpg', 'jpg', 149646, 1080, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例4', 'China', '2024', '服装买手店 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_4_image4.jpg', '/uploads/projects/p10_4_image4.jpg', 'jpg', 111499, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例1', 'China', '2024', '服装买手店 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_1_image1.jpg', '/uploads/projects/p10_1_image1.jpg', 'jpg', 111265, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例2', 'China', '2024', '服装买手店 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_2_image2.jpg', '/uploads/projects/p10_2_image2.jpg', 'jpg', 158704, 1080, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例3', 'China', '2024', '服装买手店 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_3_image3.jpg', '/uploads/projects/p10_3_image3.jpg', 'jpg', 34774, 472, 699, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例4', 'China', '2024', '服装买手店 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_4_image4.jpg', '/uploads/projects/p10_4_image4.jpg', 'jpg', 82541, 467, 700, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例5', 'China', '2024', '服装买手店 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_5_image5.jpg', '/uploads/projects/p10_5_image5.jpg', 'jpg', 88846, 1080, 726, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例1', 'China', '2024', '服装买手店 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_1_image1.jpg', '/uploads/projects/p10_1_image1.jpg', 'jpg', 143425, 1429, 1000, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例2', 'China', '2024', '服装买手店 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_2_image2.jpg', '/uploads/projects/p10_2_image2.jpg', 'jpg', 162827, 1429, 1000, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例3', 'China', '2024', '服装买手店 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_3_image3.jpg', '/uploads/projects/p10_3_image3.jpg', 'jpg', 124358, 1250, 1000, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例4', 'China', '2024', '服装买手店 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_4_image4.jpg', '/uploads/projects/p10_4_image4.jpg', 'jpg', 73901, 800, 1000, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例5', 'China', '2024', '服装买手店 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_5_image5.jpg', '/uploads/projects/p10_5_image5.jpg', 'jpg', 108203, 608, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (10, '服装买手店案例6', 'China', '2024', '服装买手店 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p10_6_image6.jpg', '/uploads/projects/p10_6_image6.jpg', 'jpg', 182493, 1429, 1000, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例1', 'China', '2024', '酒吧俱乐部 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_1_image1.jpg', '/uploads/projects/p7_1_image1.jpg', 'jpg', 97283, 1252, 682, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例2', 'China', '2024', '酒吧俱乐部 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_2_image2.jpg', '/uploads/projects/p7_2_image2.jpg', 'jpg', 135615, 1280, 739, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例3', 'China', '2024', '酒吧俱乐部 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_3_image3.jpg', '/uploads/projects/p7_3_image3.jpg', 'jpg', 189800, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例4', 'China', '2024', '酒吧俱乐部 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_4_image4.jpg', '/uploads/projects/p7_4_image4.jpg', 'jpg', 117779, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例5', 'China', '2024', '酒吧俱乐部 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_5_image5.jpg', '/uploads/projects/p7_5_image5.jpg', 'jpg', 75586, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例6', 'China', '2024', '酒吧俱乐部 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_6_image6.jpg', '/uploads/projects/p7_6_image6.jpg', 'jpg', 82783, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例1', 'China', '2024', '酒吧俱乐部 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_1_image1.jpg', '/uploads/projects/p7_1_image1.jpg', 'jpg', 63847, 1170, 658, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例2', 'China', '2024', '酒吧俱乐部 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_2_image2.jpg', '/uploads/projects/p7_2_image2.jpg', 'jpg', 49799, 1167, 729, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例3', 'China', '2024', '酒吧俱乐部 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_3_image3.jpg', '/uploads/projects/p7_3_image3.jpg', 'jpg', 211069, 1917, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例4', 'China', '2024', '酒吧俱乐部 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_4_image4.jpg', '/uploads/projects/p7_4_image4.jpg', 'jpg', 118941, 1919, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (7, '酒吧俱乐部案例5', 'China', '2024', '酒吧俱乐部 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p7_5_image5.jpg', '/uploads/projects/p7_5_image5.jpg', 'jpg', 154517, 1919, 1079, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例1', 'China', '2024', '娱乐空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_1_image1.jpg', '/uploads/projects/p3_1_image1.jpg', 'jpg', 112189, 1676, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例2', 'China', '2024', '娱乐空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_2_image2.jpg', '/uploads/projects/p3_2_image2.jpg', 'jpg', 178477, 1706, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例3', 'China', '2024', '娱乐空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_3_image3.jpg', '/uploads/projects/p3_3_image3.jpg', 'jpg', 203051, 1766, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例4', 'China', '2024', '娱乐空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_4_image4.jpg', '/uploads/projects/p3_4_image4.jpg', 'jpg', 202133, 1559, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例5', 'China', '2024', '娱乐空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_5_image5.jpg', '/uploads/projects/p3_5_image5.jpg', 'jpg', 156509, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例6', 'China', '2024', '娱乐空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_6_image6.jpg', '/uploads/projects/p3_6_image6.jpg', 'jpg', 218195, 1750, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例1', 'China', '2024', '娱乐空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_1_image1.jpg', '/uploads/projects/p3_1_image1.jpg', 'jpg', 202234, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例2', 'China', '2024', '娱乐空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_2_image2.jpg', '/uploads/projects/p3_2_image2.jpg', 'jpg', 159510, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例3', 'China', '2024', '娱乐空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_3_image3.jpg', '/uploads/projects/p3_3_image3.jpg', 'jpg', 173648, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例4', 'China', '2024', '娱乐空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_4_image5.jpg', '/uploads/projects/p3_4_image5.jpg', 'jpg', 62116, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例1', 'China', '2024', '娱乐空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_1_image1.jpg', '/uploads/projects/p3_1_image1.jpg', 'jpg', 162247, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例2', 'China', '2024', '娱乐空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_2_image2.jpg', '/uploads/projects/p3_2_image2.jpg', 'jpg', 69896, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例3', 'China', '2024', '娱乐空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_3_image3.jpg', '/uploads/projects/p3_3_image3.jpg', 'jpg', 160371, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例4', 'China', '2024', '娱乐空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_4_image4.jpg', '/uploads/projects/p3_4_image4.jpg', 'jpg', 78281, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例5', 'China', '2024', '娱乐空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_5_image5.jpg', '/uploads/projects/p3_5_image5.jpg', 'jpg', 112672, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例6', 'China', '2024', '娱乐空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_6_image6.jpg', '/uploads/projects/p3_6_image6.jpg', 'jpg', 131902, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例7', 'China', '2024', '娱乐空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_7_image7.jpg', '/uploads/projects/p3_7_image7.jpg', 'jpg', 95658, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例1', 'China', '2024', '娱乐空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_1_image1.jpg', '/uploads/projects/p3_1_image1.jpg', 'jpg', 140876, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例2', 'China', '2024', '娱乐空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_2_image2.jpg', '/uploads/projects/p3_2_image2.jpg', 'jpg', 231474, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例3', 'China', '2024', '娱乐空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_3_image3.jpg', '/uploads/projects/p3_3_image3.jpg', 'jpg', 314770, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (3, '娱乐空间案例4', 'China', '2024', '娱乐空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p3_4_image4.jpg', '/uploads/projects/p3_4_image4.jpg', 'jpg', 268303, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例1', 'China', '2024', '展厅展览 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_1_image1.jpg', '/uploads/projects/p9_1_image1.jpg', 'jpg', 43187, 734, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例2', 'China', '2024', '展厅展览 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_2_image2.jpg', '/uploads/projects/p9_2_image2.jpg', 'jpg', 40238, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例3', 'China', '2024', '展厅展览 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_3_image3.jpg', '/uploads/projects/p9_3_image3.jpg', 'jpg', 34762, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例4', 'China', '2024', '展厅展览 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_4_image4.jpg', '/uploads/projects/p9_4_image4.jpg', 'jpg', 23144, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例5', 'China', '2024', '展厅展览 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_5_image5.jpg', '/uploads/projects/p9_5_image5.jpg', 'jpg', 50237, 1396, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例6', 'China', '2024', '展厅展览 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_6_image6.jpg', '/uploads/projects/p9_6_image6.jpg', 'jpg', 34686, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例1', 'China', '2024', '展厅展览 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_1_image1.jpg', '/uploads/projects/p9_1_image1.jpg', 'jpg', 96255, 793, 533, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例2', 'China', '2024', '展厅展览 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_2_image2.jpg', '/uploads/projects/p9_2_image2.jpg', 'jpg', 349790, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例3', 'China', '2024', '展厅展览 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_3_image3.jpg', '/uploads/projects/p9_3_image3.jpg', 'jpg', 47513, 417, 583, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例4', 'China', '2024', '展厅展览 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_4_image4.jpg', '/uploads/projects/p9_4_image4.jpg', 'jpg', 113158, 1080, 806, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例5', 'China', '2024', '展厅展览 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_5_image5.jpg', '/uploads/projects/p9_5_image5.jpg', 'jpg', 36370, 412, 632, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例1', 'China', '2024', '展厅展览 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_1_image1.jpg', '/uploads/projects/p9_1_image1.jpg', 'jpg', 36881, 393, 525, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例2', 'China', '2024', '展厅展览 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_2_image2.jpg', '/uploads/projects/p9_2_image2.jpg', 'jpg', 32697, 393, 525, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例3', 'China', '2024', '展厅展览 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_3_image3.jpg', '/uploads/projects/p9_3_image3.jpg', 'jpg', 38649, 1080, 810, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例4', 'China', '2024', '展厅展览 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_4_image4.jpg', '/uploads/projects/p9_4_image4.jpg', 'jpg', 53388, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例1', 'China', '2024', '展厅展览 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_1_image1.jpg', '/uploads/projects/p9_1_image1.jpg', 'jpg', 42955, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例2', 'China', '2024', '展厅展览 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_2_image2.jpg', '/uploads/projects/p9_2_image2.jpg', 'jpg', 129975, 1280, 854, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例3', 'China', '2024', '展厅展览 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_3_image3.jpg', '/uploads/projects/p9_3_image3.jpg', 'jpg', 40959, 722, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例4', 'China', '2024', '展厅展览 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_4_image4.jpg', '/uploads/projects/p9_4_image4.jpg', 'jpg', 39107, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例5', 'China', '2024', '展厅展览 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_5_image5.jpg', '/uploads/projects/p9_5_image5.jpg', 'jpg', 41164, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例6', 'China', '2024', '展厅展览 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_6_image6.jpg', '/uploads/projects/p9_6_image6.jpg', 'jpg', 48882, 726, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例7', 'China', '2024', '展厅展览 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_7_image7.jpg', '/uploads/projects/p9_7_image7.jpg', 'jpg', 103371, 1280, 845, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (9, '展厅展览案例8', 'China', '2024', '展厅展览 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p9_8_image8.jpg', '/uploads/projects/p9_8_image8.jpg', 'jpg', 45506, 715, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 119043, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 56137, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 126615, 931, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 164305, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 128671, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 45611, 1080, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 79823, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 57201, 809, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例5', 'China', '2024', '酒店民宿 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_5_image5.jpg', '/uploads/projects/p5_5_image5.jpg', 'jpg', 118378, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例6', 'China', '2024', '酒店民宿 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_6_image6.jpg', '/uploads/projects/p5_6_image6.jpg', 'jpg', 80943, 1080, 608, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例7', 'China', '2024', '酒店民宿 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_7_image7.jpg', '/uploads/projects/p5_7_image7.jpg', 'jpg', 80571, 1080, 608, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 89620, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 124405, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 113653, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 150570, 807, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 129426, 1080, 809, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 131918, 1080, 721, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 72281, 1080, 564, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例5', 'China', '2024', '酒店民宿 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_5_image5.jpg', '/uploads/projects/p5_5_image5.jpg', 'jpg', 102449, 959, 719, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 131201, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 107183, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 165317, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 50630, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例5', 'China', '2024', '酒店民宿 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_5_image5.jpg', '/uploads/projects/p5_5_image5.jpg', 'jpg', 98015, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 85016, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 78336, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 69679, 1622, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 54383, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例5', 'China', '2024', '酒店民宿 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_5_image5.jpg', '/uploads/projects/p5_5_image5.jpg', 'jpg', 66571, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例6', 'China', '2024', '酒店民宿 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_6_image6.jpg', '/uploads/projects/p5_6_image6.jpg', 'jpg', 78545, 1614, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例1', 'China', '2024', '酒店民宿 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_1_image1.jpg', '/uploads/projects/p5_1_image1.jpg', 'jpg', 387620, 1920, 882, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例2', 'China', '2024', '酒店民宿 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_2_image2.jpg', '/uploads/projects/p5_2_image2.jpg', 'jpg', 247066, 1920, 638, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例3', 'China', '2024', '酒店民宿 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_3_image3.jpg', '/uploads/projects/p5_3_image3.jpg', 'jpg', 234021, 1920, 1067, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例4', 'China', '2024', '酒店民宿 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_4_image4.jpg', '/uploads/projects/p5_4_image4.jpg', 'jpg', 299592, 1728, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例5', 'China', '2024', '酒店民宿 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_5_image5.jpg', '/uploads/projects/p5_5_image5.jpg', 'jpg', 182582, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (5, '酒店民宿案例6', 'China', '2024', '酒店民宿 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p5_6_image6.jpg', '/uploads/projects/p5_6_image6.jpg', 'jpg', 422940, 1920, 1067, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例1', 'China', '2024', '医美空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_1_image1.jpg', '/uploads/projects/p8_1_image1.jpg', 'jpg', 217483, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例2', 'China', '2024', '医美空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_2_image2.jpg', '/uploads/projects/p8_2_image2.jpg', 'jpg', 152577, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例3', 'China', '2024', '医美空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_3_image3.jpg', '/uploads/projects/p8_3_image3.jpg', 'jpg', 201256, 1728, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例4', 'China', '2024', '医美空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_4_image4.jpg', '/uploads/projects/p8_4_image4.jpg', 'jpg', 107334, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例1', 'China', '2024', '医美空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_1_image1.jpg', '/uploads/projects/p8_1_image1.jpg', 'jpg', 58116, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例2', 'China', '2024', '医美空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_2_image2.jpg', '/uploads/projects/p8_2_image2.jpg', 'jpg', 148833, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例3', 'China', '2024', '医美空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_3_image3.jpg', '/uploads/projects/p8_3_image3.jpg', 'jpg', 127928, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例4', 'China', '2024', '医美空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_4_image4.jpg', '/uploads/projects/p8_4_image4.jpg', 'jpg', 94123, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例5', 'China', '2024', '医美空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_5_image5.jpg', '/uploads/projects/p8_5_image5.jpg', 'jpg', 71975, 864, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例1', 'China', '2024', '医美空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_1_image1.jpg', '/uploads/projects/p8_1_image1.jpg', 'jpg', 50360, 721, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例2', 'China', '2024', '医美空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_2_image2.jpg', '/uploads/projects/p8_2_image2.jpg', 'jpg', 158276, 721, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (8, '医美空间案例3', 'China', '2024', '医美空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p8_3_image3.jpg', '/uploads/projects/p8_3_image3.jpg', 'jpg', 37019, 721, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例1', 'China', '2024', '办公空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_1_image1.jpg', '/uploads/projects/p4_1_image1.jpg', 'jpg', 66060, 719, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例2', 'China', '2024', '办公空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_2_image2.jpg', '/uploads/projects/p4_2_image2.jpg', 'jpg', 81326, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例3', 'China', '2024', '办公空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_3_image3.jpg', '/uploads/projects/p4_3_image3.jpg', 'jpg', 41886, 719, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例4', 'China', '2024', '办公空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_4_image4.jpg', '/uploads/projects/p4_4_image4.jpg', 'jpg', 78630, 1280, 854, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例5', 'China', '2024', '办公空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_5_image5.jpg', '/uploads/projects/p4_5_image5.jpg', 'jpg', 73012, 1280, 854, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (4, '办公空间案例6', 'China', '2024', '办公空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p4_6_image6.jpg', '/uploads/projects/p4_6_image6.jpg', 'jpg', 91169, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 128202, 1080, 838, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 103026, 758, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 74483, 811, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 87026, 1080, 730, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 75725, 809, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 59450, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 74721, 722, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 93511, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 312232, 1920, 1056, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 217712, 1439, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 371929, 1919, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 502480, 1728, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 81544, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 74038, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 101727, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 63377, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 85993, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 164888, 1280, 960, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 115002, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 97418, 1080, 970, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例9', 'China', '2024', '私宅空间 project', NULL, 92, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_9_image9.jpg', '/uploads/projects/p1_9_image9.jpg', 'jpg', 89958, 1080, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 377958, 1920, 1056, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 301649, 1920, 960, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 152586, 917, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 143723, 864, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 280098, 1920, 960, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 128788, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image10.jpg', '/uploads/projects/p1_2_image10.jpg', 'jpg', 37331, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image2.jpg', '/uploads/projects/p1_3_image2.jpg', 'jpg', 84466, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image3.jpg', '/uploads/projects/p1_4_image3.jpg', 'jpg', 70283, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image4.jpg', '/uploads/projects/p1_5_image4.jpg', 'jpg', 95335, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image5.jpg', '/uploads/projects/p1_6_image5.jpg', 'jpg', 87796, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image6.jpg', '/uploads/projects/p1_7_image6.jpg', 'jpg', 29729, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image7.jpg', '/uploads/projects/p1_8_image7.jpg', 'jpg', 52584, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例9', 'China', '2024', '私宅空间 project', NULL, 92, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_9_image8.jpg', '/uploads/projects/p1_9_image8.jpg', 'jpg', 112398, 857, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例10', 'China', '2024', '私宅空间 project', NULL, 91, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_10_image9.jpg', '/uploads/projects/p1_10_image9.jpg', 'jpg', 103806, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 154052, 1280, 671, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 101415, 1280, 640, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 112241, 1156, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 119994, 1190, 720, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 53500, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 94318, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 55297, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 80114, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 109491, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 188569, 1920, 950, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 65498, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 60541, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 299072, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 277035, 1918, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 140642, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 102689, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 91756, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 118408, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 95175, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 179099, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 63639, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 55860, 1402, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 75195, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 48587, 1876, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 93857, 1678, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 93064, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 55164, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 222222, 1604, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 141101, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 151813, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 187308, 1666, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 72111, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 203691, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 141099, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 348913, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 78594, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 89158, 761, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 85431, 794, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 118056, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 67530, 1080, 954, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 93323, 771, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 60891, 735, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image8.jpg', '/uploads/projects/p1_8_image8.jpg', 'jpg', 52677, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 217185, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 234851, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 189615, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 165734, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 126951, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 141951, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 118429, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 68487, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 32752, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 99237, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 82511, 749, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 74872, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 128710, 1280, 967, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 77476, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 84536, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 104312, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 141951, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 118429, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 68487, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 32752, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 99237, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 82511, 749, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image7.jpg', '/uploads/projects/p1_7_image7.jpg', 'jpg', 74872, 1280, 853, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 299886, 1300, 880, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image1.jpg', '/uploads/projects/p1_2_image1.jpg', 'jpg', 196165, 1920, 690, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image2.jpg', '/uploads/projects/p1_3_image2.jpg', 'jpg', 310461, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image2.jpg', '/uploads/projects/p1_4_image2.jpg', 'jpg', 249312, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image3.jpg', '/uploads/projects/p1_5_image3.jpg', 'jpg', 365009, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image4.jpg', '/uploads/projects/p1_6_image4.jpg', 'jpg', 333914, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例7', 'China', '2024', '私宅空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_7_image5.jpg', '/uploads/projects/p1_7_image5.jpg', 'jpg', 101533, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例8', 'China', '2024', '私宅空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_8_image6.jpg', '/uploads/projects/p1_8_image6.jpg', 'jpg', 67301, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 95376, 1261, 711, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 106394, 1261, 711, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 155547, 1586, 635, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 176484, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 218382, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 87583, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 169409, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 101533, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 67301, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 196165, 1920, 690, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 249312, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 365009, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 333914, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 246892, 1920, 960, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 137199, 809, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 140076, 809, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 232463, 1920, 960, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 361085, 1836, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 248802, 1835, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 120730, 828, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 262717, 1835, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例1', 'China', '2024', '私宅空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_1_image1.jpg', '/uploads/projects/p1_1_image1.jpg', 'jpg', 230557, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例2', 'China', '2024', '私宅空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_2_image2.jpg', '/uploads/projects/p1_2_image2.jpg', 'jpg', 169488, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例3', 'China', '2024', '私宅空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_3_image3.jpg', '/uploads/projects/p1_3_image3.jpg', 'jpg', 45226, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例4', 'China', '2024', '私宅空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_4_image4.jpg', '/uploads/projects/p1_4_image4.jpg', 'jpg', 166789, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例5', 'China', '2024', '私宅空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_5_image5.jpg', '/uploads/projects/p1_5_image5.jpg', 'jpg', 124333, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (1, '私宅空间案例6', 'China', '2024', '私宅空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p1_6_image6.jpg', '/uploads/projects/p1_6_image6.jpg', 'jpg', 71499, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 183079, 1630, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 189047, 1621, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 116622, 1608, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 47214, 469, 708, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 19587, 532, 709, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 35846, 1080, 718, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 47831, 1080, 717, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 61957, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 53510, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 127247, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 255331, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 116400, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 272324, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 138858, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 135092, 852, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 66501, 721, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 137778, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 233014, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 97097, 721, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 109561, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 163709, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 213377, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 156905, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 146882, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 127807, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例7', 'China', '2024', '餐饮空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_7_image7.jpg', '/uploads/projects/p2_7_image7.jpg', 'jpg', 185574, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例8', 'China', '2024', '餐饮空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_8_image8.jpg', '/uploads/projects/p2_8_image8.jpg', 'jpg', 233602, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 76502, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 72186, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 76251, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 48710, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 93025, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 140137, 1618, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例7', 'China', '2024', '餐饮空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_7_image7.jpg', '/uploads/projects/p2_7_image7.jpg', 'jpg', 65455, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例8', 'China', '2024', '餐饮空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_8_image8.jpg', '/uploads/projects/p2_8_image8.jpg', 'jpg', 102179, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 106825, 1070, 727, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 58833, 787, 525, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 70147, 784, 523, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 69865, 784, 523, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 60991, 1293, 727, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 174111, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 206497, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 65490, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 162578, 1615, 882, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 95001, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 120542, 1616, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 48408, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 129307, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 127373, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 41096, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 220284, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 92027, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 286428, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 138877, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 85838, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 300727, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 103369, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 103830, 732, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 136902, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 110143, 1080, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 254291, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 228444, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 152906, 1642, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 160316, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 53569, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 116084, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 201098, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 192892, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 108505, 860, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 116115, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 145423, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 108050, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 181102, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 30829, 550, 310, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image10.jpg', '/uploads/projects/p2_2_image10.jpg', 'jpg', 10297, 214, 313, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image2.jpg', '/uploads/projects/p2_3_image2.jpg', 'jpg', 37433, 550, 310, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image3.jpg', '/uploads/projects/p2_4_image3.jpg', 'jpg', 20585, 550, 290, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image4.jpg', '/uploads/projects/p2_5_image4.jpg', 'jpg', 21330, 530, 290, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image5.jpg', '/uploads/projects/p2_6_image5.jpg', 'jpg', 20799, 530, 308, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例7', 'China', '2024', '餐饮空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_7_image6.jpg', '/uploads/projects/p2_7_image6.jpg', 'jpg', 26103, 461, 308, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例8', 'China', '2024', '餐饮空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_8_image7.jpg', '/uploads/projects/p2_8_image7.jpg', 'jpg', 11905, 214, 305, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例9', 'China', '2024', '餐饮空间 project', NULL, 92, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_9_image8.jpg', '/uploads/projects/p2_9_image8.jpg', 'jpg', 31750, 530, 313, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例10', 'China', '2024', '餐饮空间 project', NULL, 91, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_10_image9.jpg', '/uploads/projects/p2_10_image9.jpg', 'jpg', 10837, 214, 290, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 53297, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 268030, 1920, 1078, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 173851, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 67834, 607, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 118025, 607, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 148344, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 188969, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 71745, 607, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 38570, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 76380, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 168393, 1920, 766, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 131752, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 94140, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 134402, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 170462, 1920, 792, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 106997, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 257805, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 400876, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 56259, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 113263, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 380906, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 304906, 1614, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 90613, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 57666, 724, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 163163, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 84000, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 155336, 1617, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 348363, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 384773, 1749, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 492095, 1920, 1063, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 216856, 1680, 986, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 45483, 560, 840, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 74394, 719, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 104330, 994, 746, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image1.jpg', '/uploads/projects/p2_2_image1.jpg', 'jpg', 328607, 1920, 1078, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image2.jpg', '/uploads/projects/p2_3_image2.jpg', 'jpg', 46461, 486, 648, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image2.jpg', '/uploads/projects/p2_4_image2.jpg', 'jpg', 101606, 606, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image3.jpg', '/uploads/projects/p2_5_image3.jpg', 'jpg', 36405, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image3.jpg', '/uploads/projects/p2_6_image3.jpg', 'jpg', 82014, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例7', 'China', '2024', '餐饮空间 project', NULL, 94, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_7_image4.jpg', '/uploads/projects/p2_7_image4.jpg', 'jpg', 106418, 994, 746, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例8', 'China', '2024', '餐饮空间 project', NULL, 93, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_8_image4.jpg', '/uploads/projects/p2_8_image4.jpg', 'jpg', 323555, 1920, 1078, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例9', 'China', '2024', '餐饮空间 project', NULL, 92, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_9_image5.jpg', '/uploads/projects/p2_9_image5.jpg', 'jpg', 58550, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例10', 'China', '2024', '餐饮空间 project', NULL, 91, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_10_image6.jpg', '/uploads/projects/p2_10_image6.jpg', 'jpg', 56878, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 129496, 1057, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 60384, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 62163, 669, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 75154, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 121674, 1440, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 195464, 1920, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 104330, 994, 746, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 46461, 486, 648, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 36405, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 106418, 994, 746, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例5', 'China', '2024', '餐饮空间 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_5_image5.jpg', '/uploads/projects/p2_5_image5.jpg', 'jpg', 58550, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例6', 'China', '2024', '餐饮空间 project', NULL, 95, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_6_image6.jpg', '/uploads/projects/p2_6_image6.jpg', 'jpg', 56878, 487, 649, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 328607, 1920, 1078, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 101606, 606, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 82014, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例4', 'China', '2024', '餐饮空间 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_4_image4.jpg', '/uploads/projects/p2_4_image4.jpg', 'jpg', 323555, 1920, 1078, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例1', 'China', '2024', '餐饮空间 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_1_image1.jpg', '/uploads/projects/p2_1_image1.jpg', 'jpg', 208791, 709, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例2', 'China', '2024', '餐饮空间 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_2_image2.jpg', '/uploads/projects/p2_2_image2.jpg', 'jpg', 299963, 891, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (2, '餐饮空间案例3', 'China', '2024', '餐饮空间 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p2_3_image3.jpg', '/uploads/projects/p2_3_image3.jpg', 'jpg', 124984, 786, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例1', 'China', '2024', '婚纱摄影 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_1_image1.jpg', '/uploads/projects/p6_1_image1.jpg', 'jpg', 92932, 810, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例2', 'China', '2024', '婚纱摄影 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_2_image2.jpg', '/uploads/projects/p6_2_image2.jpg', 'jpg', 32275, 1080, 810, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例3', 'China', '2024', '婚纱摄影 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_3_image3.jpg', '/uploads/projects/p6_3_image3.jpg', 'jpg', 74833, 1080, 719, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例4', 'China', '2024', '婚纱摄影 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_4_image4.jpg', '/uploads/projects/p6_4_image4.jpg', 'jpg', 38128, 741, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例1', 'China', '2024', '婚纱摄影 project', NULL, 100, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_1_image1.jpg', '/uploads/projects/p6_1_image1.jpg', 'jpg', 95544, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例2', 'China', '2024', '婚纱摄影 project', NULL, 99, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_2_image2.jpg', '/uploads/projects/p6_2_image2.jpg', 'jpg', 78481, 720, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例3', 'China', '2024', '婚纱摄影 project', NULL, 98, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_3_image3.jpg', '/uploads/projects/p6_3_image3.jpg', 'jpg', 91197, 1620, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例4', 'China', '2024', '婚纱摄影 project', NULL, 97, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_4_image4.jpg', '/uploads/projects/p6_4_image4.jpg', 'jpg', 226964, 1637, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;

INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES (6, '婚纱摄影案例5', 'China', '2024', '婚纱摄影 project', NULL, 96, 1, 0, NOW(), NOW());
SET @pid = LAST_INSERT_ID();

INSERT INTO project_image (project_id, image_name, image_path, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid, 'p6_5_image5.jpg', '/uploads/projects/p6_5_image5.jpg', 'jpg', 116232, 1619, 1080, 1, 0, 1, NOW());
SET @iid = LAST_INSERT_ID();
UPDATE project SET cover_image_id = @iid WHERE id = @pid;