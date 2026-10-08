#!/usr/bin/env python3
"""Build the Squish Club Sandbox from the live game.

The sandbox is the same game as index.html, but:
  * Firebase is swapped for a pretend database kept in the browser
    (sandbox.js), so it never touches the kids' real saved data;
  * the tester starts with 99,999 coins and every toy unlocked;
  * a 🧪 Test tools panel adds coins, refills toys, forces scam packs,
    resets first-time screens, and runs Robo, the practice trade buddy;
  * the PWA bits (manifest, service worker) are removed.

Usage:  python3 tools/sandbox/build.py [output.html]
Default output: tools/sandbox/dist/squish-club-sandbox.html (git-ignored).
Then republish that file to the sandbox artifact (see CLAUDE.md).
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "dist", "squish-club-sandbox.html")

src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

# Item catalog (main toys + scam items) for Robo's value math and the unlock tools.
info = {}
for m in re.finditer(r'\{id:"([a-z0-9_]+)", name:"([^"]+)", emoji:"[^"]+", category:"([^"]+)", rarity:"([^"]+)"\}', src):
    info[m.group(1)] = {"n": m.group(2), "c": m.group(3), "r": m.group(4)}
if len(info) < 30:
    sys.exit("build.py: found only %d catalog items; did the ITEMS format change?" % len(info))

s = src
# 1. The artifact host adds its own document skeleton, charset and viewport.
for tag in ['<!doctype html>\n', '<html lang="en">\n', '</body>\n', '</html>\n', '</html>']:
    s = s.replace(tag, '')
for tag in ['<head>\n', '</head>\n', '<body>\n', '<meta charset="utf-8">\n',
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n']:
    s = s.replace(tag, '', 1)
# 2. Sandbox title first; drop PWA and Firebase-only head tags.
s = re.sub(r'<title>[^<]*</title>\n', '', s, count=1)
s = '<title>Squish Club Sandbox</title>\n' + s
for pat in [r'<link rel="manifest"[^>]*>\n', r'<link rel="apple-touch-icon"[^>]*>\n', r'<link rel="icon"[^>]*>\n',
            r'<!-- Preconnect so the browser.*?-->\n', r'<link rel="preconnect"[^>]*>\n',
            r'<meta name="(theme-color|mobile-web-app-capable|apple-mobile-web-app-[a-z-]+)"[^>]*>\n']:
    s = re.sub(pat, '', s, flags=re.S)
# 3. Swap the Firebase bootstrap module for the sandbox layer.
a = s.index('<!-- Firebase bootstrap')
b = s.index('</script>', s.index('<script type="module">', a)) + len('</script>')
layer = open(os.path.join(HERE, "sandbox.js"), encoding="utf-8").read().replace('__ITEM_INFO__', json.dumps(info, ensure_ascii=False))
s = s[:a] + '<!-- Sandbox: a pretend database in this browser instead of Firebase, plus test tools and Robo. -->\n<script>\n' + layer + '\n</script>' + s[b:]
# 4. No service worker in the sandbox.
s = re.sub(r"<script>\s*if\('serviceWorker' in navigator\)\{.*?</script>\n?", '', s, flags=re.S)
# 5. Sound clips are inlined: the sandbox page can't load separate files.
import base64
def _inline(m):
    path = os.path.join(ROOT, m.group(1))
    return '"data:audio/mpeg;base64,' + base64.b64encode(open(path, "rb").read()).decode() + '"'
s, n_sounds = re.subn(r'"(sounds/[a-z0-9_]+\.mp3)"', _inline, s)
# 6. Test panel styles.
s = s.replace('</style>', open(os.path.join(HERE, "sandbox.css"), encoding="utf-8").read() + '\n</style>', 1)

assert 'gstatic.com/firebasejs' not in s, "Firebase import survived"
assert 'serviceWorker' not in s, "service worker registration survived"
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(s)
print("Built %s (%d bytes, %d catalog items, %d sound clips inlined)" % (OUT, len(s), len(info), n_sounds))
