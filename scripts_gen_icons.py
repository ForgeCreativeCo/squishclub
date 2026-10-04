import numpy as np
from PIL import Image, ImageDraw
import math, random

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def radial_bg(size, c_center, c_edge):
    n = size
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    cx, cy = n * 0.38, n * 0.30
    dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    maxd = np.sqrt(n ** 2 + n ** 2) * 0.62
    t = np.clip(dist / maxd, 0, 1)
    c0 = np.array(hex_to_rgb(c_center), dtype=np.float32)
    c1 = np.array(hex_to_rgb(c_edge), dtype=np.float32)
    img = (c0[None, None, :] * (1 - t[:, :, None]) + c1[None, None, :] * t[:, :, None]).astype(np.uint8)
    return Image.fromarray(img, 'RGB')

def rounded_mask(size, radius):
    m = Image.new('L', (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m

def blob_points(cx, cy, r, wobble, seed, n_pts=28):
    random.seed(seed)
    pts = []
    for i in range(n_pts):
        ang = 2 * math.pi * i / n_pts
        rr = r * (1 + wobble * math.sin(ang * 3 + seed) * 0.6 + wobble * (random.random() - 0.5) * 0.4)
        pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
    return pts

def make_icon(size, maskable, out_path):
    bg = radial_bg(size, "#FF8FC4", "#9B4FE0").convert('RGBA')
    draw = ImageDraw.Draw(bg)

    content_scale = 0.60 if maskable else 0.84
    cx, cy = size * 0.5, size * 0.5
    big_r = size * 0.5 * content_scale * 0.56

    # small mint accent bubble (back), solid fill, no blur
    draw.polygon(blob_points(cx + big_r * 0.62, cy + big_r * 0.68, big_r * 0.48, 0.16, 3), fill=hex_to_rgb('#1FA971'))
    # main white/pink bubble (front)
    draw.polygon(blob_points(cx - big_r * 0.18, cy - big_r * 0.1, big_r, 0.14, 7), fill=(255, 250, 253, 255))

    # soft glossy highlight: concentric ellipses, decreasing alpha, no blur needed
    hx, hy = cx - big_r * 0.42, cy - big_r * 0.48
    for i, (rx, ry, a) in enumerate([(0.30, 0.19, 70), (0.22, 0.13, 60), (0.13, 0.08, 55)]):
        draw.ellipse(
            [hx - big_r * rx, hy - big_r * ry, hx + big_r * rx, hy + big_r * ry],
            fill=(255, 255, 255, a)
        )

    img = bg
    if not maskable:
        mask = rounded_mask(size, int(size * 0.22)).convert('L')
        out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out

    img.save(out_path)
    print('wrote', out_path, img.size)

make_icon(192, False, '/home/claude/squishclub/icons/icon-192.png')
make_icon(512, False, '/home/claude/squishclub/icons/icon-512.png')
make_icon(512, True, '/home/claude/squishclub/icons/icon-maskable-512.png')
make_icon(180, False, '/home/claude/squishclub/icons/apple-touch-icon.png')
