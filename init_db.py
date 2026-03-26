"""
数据库初始化脚本
"""

import mysql.connector

DB_CONFIG = {
    'host': '8.137.63.159',
    'user': 'root',
    'password': '@Yuku007@',
    'charset': 'utf8mb4'
}

def init_database():
    # 连接 MySQL（不指定数据库）
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # 创建数据库
    cursor.execute("DROP DATABASE IF EXISTS gio_design")
    cursor.execute("CREATE DATABASE gio_design DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci")
    cursor.execute("USE gio_design")

    # 创建分类表
    cursor.execute("""
    CREATE TABLE `category` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `name` VARCHAR(50) NOT NULL,
      `name_en` VARCHAR(50) NOT NULL,
      `code` VARCHAR(50) UNIQUE NOT NULL,
      `sort_order` INT DEFAULT 0,
      `status` TINYINT DEFAULT 1,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    # 创建项目表
    cursor.execute("""
    CREATE TABLE `project` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `category_id` INT NOT NULL,
      `name` VARCHAR(100) NOT NULL,
      `location` VARCHAR(100),
      `year` VARCHAR(20),
      `description` TEXT,
      `cover_image_id` INT,
      `sort_order` INT DEFAULT 0,
      `status` TINYINT DEFAULT 1,
      `view_count` INT DEFAULT 0,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_category` (`category_id`),
      INDEX `idx_status` (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    # 创建图片表
    cursor.execute("""
    CREATE TABLE `project_image` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `project_id` INT NOT NULL,
      `image_name` VARCHAR(200),
      `image_path` VARCHAR(500),
      `image_type` VARCHAR(20) DEFAULT 'jpg',
      `file_size` INT,
      `width` INT,
      `height` INT,
      `is_cover` TINYINT DEFAULT 0,
      `sort_order` INT DEFAULT 0,
      `status` TINYINT DEFAULT 1,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX `idx_project` (`project_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    # 创建管理员表
    cursor.execute("""
    CREATE TABLE `admin_user` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `username` VARCHAR(50) UNIQUE NOT NULL,
      `password` VARCHAR(255) NOT NULL,
      `nickname` VARCHAR(50),
      `avatar` VARCHAR(500),
      `role` VARCHAR(20) DEFAULT 'editor',
      `status` TINYINT DEFAULT 1,
      `last_login_at` TIMESTAMP NULL,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    # 创建操作日志表
    cursor.execute("""
    CREATE TABLE `operation_log` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `admin_id` INT,
      `action` VARCHAR(50),
      `module` VARCHAR(50),
      `content` TEXT,
      `ip` VARCHAR(50),
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX `idx_admin` (`admin_id`),
      INDEX `idx_created` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """)

    # 插入分类数据
    categories = [
        ('私宅空间', 'Residence', 'residential', 1, 1),
        ('餐饮空间', 'Restaurant', 'restaurant', 2, 1),
        ('娱乐空间', 'Entertainment', 'entertainment', 3, 1),
        ('办公空间', 'Office', 'office', 4, 1),
        ('酒店民宿', 'Hotel', 'hotel', 5, 1),
        ('婚纱摄影', 'Wedding', 'wedding', 6, 1),
        ('酒吧俱乐部', 'Club', 'club', 7, 1),
        ('医美空间', 'Medical', 'medical', 8, 1),
        ('展厅展览', 'Exhibition', 'exhibition', 9, 1),
        ('服装买手店', 'Clothing', 'clothing', 10, 1),
    ]

    cursor.executemany(
        "INSERT INTO category (name, name_en, code, sort_order, status) VALUES (%s, %s, %s, %s, %s)",
        categories
    )

    # 插入默认管理员（密码需要 BCrypt 加密）
    import bcrypt
    password_hash = bcrypt.hashpw('admin123'.encode('utf-8')), bcrypt.gensalt()
    cursor.execute(
        "INSERT INTO admin_user (username, password, nickname, role, status) VALUES (%s, %s, %s, %s, %s)",
        ('admin', password_hash.decode('utf-8'), 'Admin', 'admin', 1)
    )

    conn.commit()
    cursor.close()
    conn.close()

    print("数据库初始化完成!")

if __name__ == '__main__':
    init_database()
