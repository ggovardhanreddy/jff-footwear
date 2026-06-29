#!/usr/bin/env python3
"""Process JFF slipper photos: light tag cleanup, studio background, web export."""

from __future__ import annotations

import re
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from rembg import remove

SRC = Path(
    "/Users/govardhan.reddy.g.94gmail.com/Library/Application Support/Cursor"
    "/User/workspaceStorage/empty-window/images"
)
DST = Path("/Users/govardhan.reddy.g.94gmail.com/Projects/jff-footwear/images")


def tag_mask(img_bgr: np.ndarray) -> np.ndarray:
    """Mask only bright white hang-tags (safe — avoids footbed texture)."""
    h, w = img_bgr.shape[:2]
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    white = cv2.inRange(hsv, (0, 0, 215), (180, 45, 255))

    refined = np.zeros((h, w), np.uint8)
    contours, _ = cv2.findContours(white, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 600 or area > 22000:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        if y > h * 0.72 or bw > w * 0.4:
            continue
        if bw / max(bh, 1) < 0.35 or bw / max(bh, 1) > 3.5:
            continue
        pad = 4
        cv2.rectangle(
            refined,
            (max(x - pad, 0), max(y - pad, 0)),
            (min(x + bw + pad, w), min(y + bh + pad, h)),
            255,
            -1,
        )

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    return cv2.dilate(refined, kernel, iterations=1)


def remove_tags_bgr(img: np.ndarray) -> np.ndarray:
    mask = tag_mask(img)
    if cv2.countNonZero(mask) < 80:
        return img
    return cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)


def studio_composite(rgba: Image.Image, size: int = 900) -> Image.Image:
    rgba = rgba.convert("RGBA")
    alpha = rgba.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return rgba.convert("RGB")

    cropped = rgba.crop(bbox)
    pad = int(max(cropped.size) * 0.1)
    canvas = Image.new("RGBA", (cropped.width + pad * 2, cropped.height + pad * 2), (0, 0, 0, 0))
    ox, oy = pad, pad + int(pad * 0.1)

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sh = Image.new("RGBA", cropped.size, (0, 0, 0, 65))
    shadow.paste(sh, (ox + 5, oy + 10), cropped.split()[-1])
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(cropped, (ox, oy), cropped)

    side = max(canvas.size)
    bg = Image.new("RGB", (side, side), (248, 248, 250))
    for y in range(side):
        v = 252 - int((y / max(side - 1, 1)) * 12)
        for x in range(side):
            bg.putpixel((x, y), (v, v, v + 1))

    out = bg.copy()
    px = (side - canvas.size[0]) // 2
    py = (side - canvas.size[1]) // 2
    out.paste(canvas, (px, py), canvas)

    out = ImageEnhance.Contrast(out).enhance(1.04)
    out = ImageEnhance.Color(out).enhance(1.03)
    out = ImageEnhance.Sharpness(out).enhance(1.06)

    if side != size:
        out = out.resize((size, size), Image.Resampling.LANCZOS)
    return out


def process_file(src_path: Path, out_path: Path, size: int = 900, quality: int = 84) -> None:
    raw = ImageOps.exif_transpose(Image.open(src_path)).convert("RGB")
    bgr = cv2.cvtColor(np.array(raw), cv2.COLOR_RGB2BGR)
    cleaned = remove_tags_bgr(bgr)
    pil = Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB))
    cutout = remove(pil)
    studio = studio_composite(cutout, size=size)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    studio.save(out_path, "JPEG", quality=quality, optimize=True, progressive=True)


def main() -> None:
    nums = sorted({re.match(r"IMG_(\d+)", p.name).group(1) for p in SRC.glob("IMG_*.png")})
    for num in nums:
        src = next(SRC.glob(f"IMG_{num}-*.png"))
        out = DST / "gallery" / f"{num}-800.jpg"
        print(f"Processing {num}...")
        process_file(src, out)

    mapping = {
        "hero/hero-1920.jpg": ("0381", 1200),
        "hero/hero-1280.jpg": ("0381", 1000),
        "hero/hero-768.jpg": ("0381", 768),
        "showcase/craft-1600.jpg": ("0374", 1100),
        "showcase/craft-960.jpg": ("0374", 900),
        "showcase/comfort-1600.jpg": ("0363", 1100),
        "showcase/comfort-960.jpg": ("0363", 900),
        "showcase/style-1600.jpg": ("0386", 1100),
        "showcase/style-960.jpg": ("0386", 900),
        "about/about-1200.jpg": ("0370", 1000),
        "about/about-768.jpg": ("0370", 768),
    }
    for rel, (num, size) in mapping.items():
        src = next(SRC.glob(f"IMG_{num}-*.png"))
        print(f"Processing {rel}...")
        process_file(src, DST / rel, size=size)

    total_kb = sum(p.stat().st_size for p in DST.rglob("*.jpg")) // 1024
    print(f"Done. {len(nums)} products, total ~{total_kb} KB")


if __name__ == "__main__":
    main()
