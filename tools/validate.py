#!/usr/bin/env python3
"""Site checks: run `python3 tools/validate.py` before pushing. Exits 1 on any problem."""
import re, os, sys, glob, json
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
errors = []

# every photo listed in photos.js must exist
js = '\n'.join(l for l in open('photos.js').read().splitlines() if not l.lstrip().startswith('//'))
for m in re.finditer(r"src:(?:'([^']+)'|\"([^\"]+)\")", js):
    p = m.group(1) or m.group(2)
    if not os.path.exists(p):
        errors.append(f'photos.js: missing file {p}')

# every local file referenced from the HTML must exist
for page in glob.glob('*.html'):
    html = open(page).read()
    is404 = page == '404.html'
    for ref in re.findall(r'(?:src|href)="([^"#?:]+)"', html):
        if ref.startswith(('http', '//', 'mailto', 'tel', 'data')):
            continue
        if ref != '/' and not os.path.exists(ref.lstrip('/')):
            errors.append(f'{page}: missing local file {ref}')
    for img in re.findall(r'<img[^>]*>', html):
        if 'alt=' not in img:
            errors.append(f'{page}: <img> without alt: {img[:80]}')
    for need in ([] if is404 else ['<title>', 'rel="canonical"', 'og:image', 'name="description"']):
        if need not in html:
            errors.append(f'{page}: missing {need}')

# files that exist but are not in any album (info only)
used = set(re.findall(r"src:(?:'([^']+)'|\"[^\"]+\")", js)) | set(re.findall(r'src:"([^"]+)"', js))
unused = [f for f in glob.glob('photos/**/*.jpg', recursive=True) if f not in used and not f.endswith('cover.jpg')]
if unused:
    print('Note: photos not used in any album:', *unused, sep='\n  ')

json.load(open('site.webmanifest'))
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('OK: all checks passed')
