#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将图片转换为 Base64 并保存到 attachment 表
"""

import os
import base64
import pymysql

DB_CONFIG = {
    'host': '8.137.63.159',
    'port': 3306,
    'user': 'root',
    'password': '@Yuku007@',
    'database': 'gio_design',
    'charset': 'utf8mb4'
}

IMAGE_DIR = r'E:\my_projects\gio\uploads\projects'

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def main():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 获取所有 project_image 记录
    cursor.execute("SELECT id, image_name, project_id FROM project_image WHERE status = 1")
    images = cursor.fetchall()

    print(f"找到 {len(images)} 条项目图片记录")

    # 创建 image_name -> id 的映射
    img_map = {}
    for img_id, img_name, proj_id in images:
        # 移除文件扩展名作为 key
        key = img_name.replace('.jpg', '').replace('.png', '')
        img_map[key] = img_id

    inserted = 0
    skipped = 0

    # 遍历 uploads/projects 目录
    for filename in os.listdir(IMAGE_DIR):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        filepath = os.path.join(IMAGE_DIR, filename)
        file_size = os.path.getsize(filepath)

        # 读取图片并转为 Base64
        with open(filepath, 'rb') as f:
            img_data = f.read()
            b64_data = base64.b64encode(img_data).decode('utf-8')

        # 查找对应的 project_image id
        key = os.path.splitext(filename)[0]

        # 尝试多种匹配方式
        img_id = img_map.get(key)

        if not img_id:
            # 尝试模糊匹配
            for map_key, map_id in img_map.items():
                if key in map_key or map_key in key:
                    img_id = map_id
                    break

        if img_id:
            # 插入 attachment 表
            cursor.execute("""
                INSERT INTO attachment (business_type, business_id, file_name, file_type, file_size, base64_data, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """, ('project_image', img_id, filename, 'jpg', file_size, b64_data))
            inserted += 1
        else:
            print(f"未找到匹配: {filename}")
            skipped += 1

    conn.commit()

    # 验证插入数量
    cursor.execute("SELECT COUNT(*) FROM attachment")
    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    print(f"\n完成! 插入 {inserted} 条记录, 跳过 {skipped} 条")
    print(f"attachment 表共 {count} 条记录")

if __name__ == '__main__':
    main()