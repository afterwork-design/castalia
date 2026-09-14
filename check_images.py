import json, os, subprocess, concurrent.futures

ROOT = '/Users/tangweijuan/twj/castalia'
data = json.load(open(f'{ROOT}/src/server/resource.json'))

items = []  # (category, name, image)
for c in data:
    for s in c['site']:
        items.append((c['name'], s['name'], s.get('image', '')))

def check(it):
    cat, name, img = it
    if not img:
        return (cat, name, img, 'EMPTY', '')
    if img.startswith('./'):
        path = os.path.join(ROOT, 'public', img[2:])
        return (cat, name, img, 'OK' if os.path.exists(path) else 'LOCAL_MISSING', path)
    if img.startswith('data:'):
        return (cat, name, img, 'DATA', '')
    r = subprocess.run(
        ['curl', '-o', '/dev/null', '-s', '-w', '%{http_code}', '-L', '--max-time', '10',
         '-A', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', img],
        capture_output=True, text=True)
    code = r.stdout.strip()
    return (cat, name, img, 'HTTP_' + code, code)

with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
    results = list(ex.map(check, items))

bad = [r for r in results if r[3] not in ('OK', 'DATA', 'HTTP_200', 'HTTP_204')]
print(f'total={len(results)} bad={len(bad)}')
for cat, name, img, status, extra in bad:
    print(f'{status:14} [{cat}] {name} -> {img[:100]}')
