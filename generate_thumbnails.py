"""
为所有图片生成缩略图
"""
import pymysql
import base64
import io
from PIL import Image
import sys

DB_CONFIG = {
    'host': '8.137.63.159',
    'user': 'root',
    'password': '@Yuku007@',
    'database': 'gio_design',
    'charset': 'utf8mb4'
}

def generate_thumbnail(image_data, target_width=400):
    """生成缩略图"""
    try:
        img = Image.open(io.BytesIO(image_data))
        # 转换为 RGB 模式（RGBA 转 RGB）
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        # 保持宽高比 - 使用旧版 API
        w_percent = target_width / float(img.size[0])
        h_size = int(float(img.size[1]) * float(w_percent))
        img = img.resize((target_width, h_size), Image.LANCZOS)

        output = io.BytesIO()
        img.save(output, format='JPEG', quality=70)
        return output.getvalue(), target_width, h_size
    except Exception as e:
        print(f"生成缩略图失败: {e}")
        return None, 0, 0

def main():
    pymysql.install_as_MySQLdb()
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # 获取所有没有缩略图的 attachment
    cursor.execute("""
        SELECT id, base64_data, width, height
        FROM attachment
        WHERE (thumbnail_data IS NULL OR thumbnail_data = '')
        AND base64_data IS NOT NULL
        AND base64_data != ''
    """)

    rows = cursor.fetchall()
    total = len(rows)

    if total == 0:
        print("所有图片已有缩略图")
        return

    print(f"开始为 {total} 张图片生成缩略图...")

    success_count = 0
    error_count = 0

    for i, row in enumerate(rows):
        att_id, base64_data, width, height = row

        try:
            image_data = base64.b64decode(base64_data)
            thumb_data, thumb_w, thumb_h = generate_thumbnail(image_data)

            if thumb_data:
                # 保存缩略图
                thumb_base64 = base64.b64encode(thumb_data).decode('utf-8')
                cursor.execute("""
                    UPDATE attachment
                    SET thumbnail_data = %s, thumbnail_width = %s, thumbnail_height = %s
                    WHERE id = %s
                """, (thumb_base64, thumb_w, thumb_h, att_id))
                success_count += 1
            else:
                error_count += 1

            if (i + 1) % 50 == 0:
                conn.commit()
                print(f"进度: {i + 1}/{total}")

        except Exception as e:
            print(f"处理图片 {att_id} 失败: {e}")
            error_count += 1

    conn.commit()
    cursor.close()
    conn.close()

    print(f"\n完成! 成功: {success_count}, 失败: {error_count}")

if __name__ == '__main__':
    main()