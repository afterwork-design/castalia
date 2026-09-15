import json, os, re, subprocess
from urllib.parse import urljoin

ROOT = '/Users/tangweijuan/twj/castalia'
IMG_DIR = f'{ROOT}/public/images/site'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
HDRS = ['-H', f'User-Agent: {UA}', '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        '-H', 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8', '-H', 'Sec-Fetch-Dest: document',
        '-H', 'Sec-Fetch-Mode: navigate', '-H', 'Sec-Fetch-Site: none', '--compressed']
data = json.load(open(f'{ROOT}/src/server/resource.json'))

targets = ['A11Y Collective', 'My Secret Rainbow', 'Product Design Psychology',
           'SPACE TYPE GENERATOR', 'Color Palette Pro', 'Paint but...', 'Textures',
           'CodePen', 'bloub', '国家标准', 'VOA Learning English', 'QuillBot',
           'ColorDrop', 'Pixabay', 'StockSnap', 'IMGBIN', 'POND5', '字体搬运工']

def curl(url, extra=None, timeout=25, referer=None):
    cmd = ['curl', '-s', '-L', '--max-time', str(timeout)] + HDRS[:]
    if referer:
        cmd += ['-e', referer]
    return subprocess.run(cmd + (extra or []) + [url], capture_output=True)

def slug(name):
    s = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower()
    pinyin = {'国家标准': 'guojiabiaozhun', '字体搬运工': 'zitibanyungong'}
    return pinyin.get(name, s or 'site-icon')

def try_save(name, content):
    if not content or len(content) < 100:
        return None
    head = content[:600].lower()
    if b'<html' in head or b'<!doctype html' in head:
        return None
    if b'<svg' in content[:400]:
        ext = '.svg'
    elif content[:4] == b'\x89PNG':
        ext = '.png'
    elif content[:3] == b'GIF':
        ext = '.gif'
    elif content[:2] == b'\xff\xd8':
        ext = '.jpg'
    elif content[:2] == b'BM':
        ext = '.bmp'
    else:
        ext = '.ico'
    fname = slug(name) + ext
    open(f'{IMG_DIR}/{fname}', 'wb').write(content)
    return './images/site/' + fname

by_name = {s['name']: s for c in data for s in c['site']}
fixed, failed = [], []

for name in targets:
    s = by_name[name]
    site = s['url']
    domain = re.match(r'https?://[^/]+', site).group(0)
    referer = domain + '/'
    candidates = []
    # 1. parse homepage for icon links
    r = curl(site, referer=referer)
    if r.returncode == 0 and r.stdout:
        html = r.stdout[:300000].decode('utf-8', 'ignore')
        for m in re.finditer(r'<link[^>]+rel=["\'][^"\']*(?:apple-touch-icon|shortcut icon|icon|mask-icon|fluid-icon)[^"\']*["\'][^>]*>', html, re.I):
            href = re.search(r'href=["\']([^"\']+)["\']', m.group(0), re.I)
            if href:
                u = urljoin(site, href.group(1))
                if u.startswith('http') and u not in candidates:
                    candidates.append(u)
    # 2. common fallbacks
    for u in [domain + '/favicon.ico', domain + '/favicon.svg', domain + '/apple-touch-icon.png']:
        if u not in candidates:
            candidates.append(u)
    saved = None
    for u in candidates:
        r = curl(u, ['-o', '/tmp/iconretry2.bin', '-w', '%{http_code}'], referer=referer, timeout=20)
        if r.stdout.decode(errors='ignore').strip() in ('200', '204'):
            saved = try_save(name, open('/tmp/iconretry2.bin', 'rb').read())
            if saved:
                print(f'  {name}: got {u}')
                break
    if saved:
        s['image'] = saved
        fixed.append(f'{name} -> {saved}')
    else:
        failed.append(f'{name} ({site})')

with open(f'{ROOT}/src/server/resource.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
    f.write('\n')

print(f'\n=== fixed {len(fixed)} ===')
print('\n'.join(fixed))
print(f'=== still failed {len(failed)} ===')
print('\n'.join(failed))
