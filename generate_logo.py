#!/usr/bin/env python3
"""
GIO Logo Avatar Generator
生成微信小程序专用的头像logo
尺寸：144x144 像素
格式：PNG
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gio_logo(output_path="gio_logo_avatar.png", size=144):
    """生成GIO微信小程序头像"""

    # 创建画布
    img = Image.new('RGBA', (size, size), (26, 26, 26, 255))  # #1a1a1a 背景
    draw = ImageDraw.Draw(img)

    # 绘制圆角矩形背景（模拟圆角）
    def draw_rounded_rect(draw, xy, radius, fill):
        x1, y1, x2, y2 = xy
        # 四个圆角
        draw.ellipse([x1, y1, x1 + radius * 2, y1 + radius * 2], fill=fill)
        draw.ellipse([x2 - radius * 2, y1, x2, y1 + radius * 2], fill=fill)
        draw.ellipse([x1, y2 - radius * 2, x1 + radius * 2, y2], fill=fill)
        draw.ellipse([x2 - radius * 2, y2 - radius * 2, x2, y2], fill=fill)
        # 矩形填充
        draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
        draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)

    # 绘制背景（深色）
    draw_rounded_rect(draw, (0, 0, size, size), 12, (26, 26, 26, 255))

    # 颜色定义
    gold = (201, 169, 98, 255)  # #c9a962
    white = (255, 255, 255, 255)

    # 尝试使用系统字体
    try:
        # Windows 字体
        font_gio = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 48)
        font_cn = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 11)
        font_en = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 8)
    except:
        try:
            # macOS 字体
            font_gio = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
            font_cn = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 11)
            font_en = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 8)
        except:
            try:
                # Linux 字体
                font_gio = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
                font_cn = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc", 11)
                font_en = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 8)
            except:
                # 使用默认字体
                font_gio = ImageFont.load_default()
                font_cn = ImageFont.load_default()
                font_en = ImageFont.load_default()

    # 绘制 GIO 大字
    gio_text = "GIO"
    bbox = draw.textbbox((0, 0), gio_text, font=font_gio)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = 35
    draw.text((x, y), gio_text, font=font_gio, fill=gold)

    # 绘制中文 光里光外
    cn_text = "光里光外"
    bbox = draw.textbbox((0, 0), cn_text, font=font_cn)
    text_width = bbox[2] - bbox[0]
    x = (size - text_width) // 2
    y = 90
    draw.text((x, y), cn_text, font=font_cn, fill=white)

    # 绘制英文 LIGHTING
    en_text = "LIGHTING"
    bbox = draw.textbbox((0, 0), en_text, font=font_en)
    text_width = bbox[2] - bbox[0]
    x = (size - text_width) // 2
    y = 110
    draw.text((x, y), en_text, font=font_en, fill=gold)

    # 保存图片
    img.save(output_path, 'PNG', optimize=True)

    # 输出信息
    file_size = os.path.getsize(output_path)
    print(f"[OK] Logo generated: {output_path}")
    print(f"  Size: {size}x{size} pixels")
    print(f"  Format: PNG")
    print(f"  File size: {file_size / 1024:.2f} KB")
    print(f"  Meet WeChat requirement (<=2MB): {'Yes' if file_size < 2*1024*1024 else 'No'}")

    return output_path

if __name__ == "__main__":
    # 生成 144x144 的logo
    output = create_gio_logo("gio_logo_avatar_144.png", 144)

    # 同时生成其他常用尺寸
    create_gio_logo("gio_logo_avatar_64.png", 64)   # 64x64
    create_gio_logo("gio_logo_avatar_100.png", 100) # 100x100
    create_gio_logo("gio_logo_avatar_300.png", 300) # 300x300 (高清备用)

    print("\nTip: gio_logo_avatar_144.png is the recommended size for WeChat Mini Program")
