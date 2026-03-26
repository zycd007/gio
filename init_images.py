#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成导入数据的 SQL 脚本
- 解析源目录结构：分类文件夹 -> 项目文件夹 -> 图片
- 生成 SQL 插入语句（包括 base64 数据）
"""

import os
import base64
import sys
from PIL import Image
from io import BytesIO

# 源数据目录
IMAGE_DIR = r'E:\GIO\projects_images\images'
SQL_FILE = r'E:\my_projects\gio\import_projects.sql'

# 分类映射（文件夹前缀 -> category_id）
CATEGORY_PREFIX_MAP = {
    'clothing': 10,      # 服装买手店
    'club': 7,          # 酒吧俱乐部
    'entertainment': 3, # 娱乐空间
    'exhibition': 9,   # 展厅展览
    'hotel': 5,        # 酒店民宿
    'medical': 8,      # 医美空间
    'office': 4,       # 办公空间
    'residential': 1,  # 私宅空间
    'restaurant': 2,   # 餐饮空间
    'wedding': 6,      # 婚纱摄影
}


def compress_image_to_base64(src_path, max_width=1920, max_height=1080, quality=85):
    """压缩图片并转换为 base64"""
    try:
        img = Image.open(src_path)
    except Exception as e:
        print(f"    无法打开图片: {src_path} - {e}")
        return None

    orig_w, orig_h = img.size
    if orig_w == 0 or orig_h == 0:
        return None

    # 计算缩放比例
    ratio = min(max_width / orig_w, max_height / orig_h, 1)
    new_w = int(orig_w * ratio)
    new_h = int(orig_h * ratio)

    # 缩放图片
    if ratio < 1:
        img = img.resize((new_w, new_h), Image.LANCZOS)

    # 转换模式
    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # 转为 base64
    buffer = BytesIO()
    img.save(buffer, 'JPEG', quality=quality, optimize=True)
    img_bytes = buffer.getvalue()
    base64_data = base64.b64encode(img_bytes).decode('utf-8')
    file_size = len(img_bytes)

    return {
        'base64': base64_data,
        'width': new_w,
        'height': new_h,
        'type': 'jpg',
        'size': file_size,
        'name': os.path.basename(src_path)
    }


def escape_sql(s):
    """转义 SQL 字符串"""
    if s is None:
        return ''
    return str(s).replace("'", "''").replace("\\", "\\\\")


def process_category(category_folder):
    """处理一个分类文件夹"""
    prefix = category_folder.split('_')[0]
    category_id = CATEGORY_PREFIX_MAP.get(prefix)

    if not category_id:
        return []

    category_path = os.path.join(IMAGE_DIR, category_folder)
    if not os.path.isdir(category_path):
        return []

    results = []

    for project_folder in os.listdir(category_path):
        project_path = os.path.join(category_path, project_folder)
        if not os.path.isdir(project_path):
            continue

        # 解析项目信息：项目名_城市_年份 或 项目名_城市
        parts = project_folder.split('_')
        if len(parts) >= 3:
            # 格式：项目名_城市_年份
            name = parts[0]
            location = parts[1]
            year = parts[2]
        elif len(parts) >= 2:
            # 格式：项目名_城市 （无年份）
            name = parts[0]
            location = parts[1]
            year = '2024'  # 默认年份
        else:
            print(f"  跳过无效项目文件夹: {project_folder}")
            continue

        # 获取图片文件
        image_files = sorted([
            f for f in os.listdir(project_path)
            if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        ])

        if not image_files:
            print(f"  跳过无图片项目: {project_folder}")
            continue

        # 处理所有图片
        images_data = []
        for img_file in image_files:
            img_path = os.path.join(project_path, img_file)
            try:
                img_data = compress_image_to_base64(img_path)
                if img_data:
                    images_data.append(img_data)
            except Exception as e:
                print(f"    错误: {img_file} - {e}")

        if images_data:
            results.append({
                'category_id': category_id,
                'name': name,
                'location': location,
                'year': year,
                'images': images_data
            })

    return results


def generate_sql(projects_data):
    """生成 SQL 插入语句"""
    sql_statements = []
    sql_statements.append("SET NAMES utf8mb4;")
    sql_statements.append("SET FOREIGN_KEY_CHECKS = 0;")
    sql_statements.append("TRUNCATE TABLE project_image;")
    sql_statements.append("TRUNCATE TABLE attachment;")
    sql_statements.append("TRUNCATE TABLE project;")
    sql_statements.append("SET FOREIGN_KEY_CHECKS = 1;")
    sql_statements.append("")

    project_count = 0

    for project in projects_data:
        project_count += 1
        sort_order = 100 - project_count

        # 插入项目
        sql_statements.append(f"""INSERT INTO project (category_id, name, location, year, description, cover_image_id, sort_order, status, view_count, created_at, updated_at)
VALUES ({project['category_id']}, '{escape_sql(project['name'])}', '{escape_sql(project['location'])}', '{escape_sql(project['year'])}', '', NULL, {sort_order}, 1, 0, NOW(), NOW());
SET @pid{project_count} = LAST_INSERT_ID();""")

        cover_id = None

        # 插入图片
        for idx, img in enumerate(project['images']):
            is_cover = 1 if idx == 0 else 0

            # 插入 attachment
            sql_statements.append(f"""INSERT INTO attachment (business_type, business_id, file_name, file_type, file_size, base64_data, width, height, created_at)
VALUES ('project_image', @pid{project_count}, '{escape_sql(img['name'])}', '{img['type']}', {img['size']}, '{img['base64']}', {img['width']}, {img['height']}, NOW());
SET @att{project_count}_{idx} = LAST_INSERT_ID();""")

            # 插入 project_image
            sql_statements.append(f"""INSERT INTO project_image (project_id, image_name, attachment_id, image_type, file_size, width, height, is_cover, sort_order, status, created_at)
VALUES (@pid{project_count}, '{escape_sql(img['name'])}', @att{project_count}_{idx}, '{img['type']}', {img['size']}, {img['width']}, {img['height']}, {is_cover}, {idx}, 1, NOW());""")

            if is_cover:
                sql_statements.append(f"SET @cover{project_count} = @att{project_count}_{idx};")

        # 更新封面
        sql_statements.append(f"UPDATE project SET cover_image_id = @cover{project_count} WHERE id = @pid{project_count};")
        sql_statements.append("")

    return '\n'.join(sql_statements)


def main():
    print("=" * 50)
    print("GIO 项目数据导入 - SQL 生成工具")
    print("=" * 50)

    # 处理所有分类
    print("\n[1/2] 处理图片数据...")
    all_projects = []

    category_folders = sorted(os.listdir(IMAGE_DIR))
    total_images = 0

    for category_folder in category_folders:
        print(f"\n处理分类: {category_folder}")
        projects = process_category(category_folder)
        for p in projects:
            total_images += len(p['images'])
        all_projects.extend(projects)

    print(f"\n共找到 {len(all_projects)} 个项目, {total_images} 张图片")

    # 生成 SQL
    print("\n[2/2] 生成 SQL 文件...")
    sql_content = generate_sql(all_projects)

    with open(SQL_FILE, 'w', encoding='utf-8') as f:
        f.write(sql_content)

    file_size = os.path.getsize(SQL_FILE) / 1024 / 1024
    print(f"OK - SQL file: {SQL_FILE}")
    print(f"  文件大小: {file_size:.2f} MB")
    print("\n请执行以下命令导入数据:")
    print(f"  mysql -h 8.137.63.159 -u root -p'@Yuku007@' gio_design < \"{SQL_FILE}\"")


if __name__ == '__main__':
    main()