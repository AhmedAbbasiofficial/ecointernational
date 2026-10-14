import urllib.request
import re

urls = ['/', '/products', '/products/solar-inverters', '/products/lithium-batteries', '/products/all-in-one']
links_to_test = set()
for u in urls:
    try:
        html = urllib.request.urlopen('http://localhost:8080' + u).read().decode('utf-8')
        hrefs = re.findall(r'href="(/products/[^"#?]+)"', html)
        for h in hrefs:
            links_to_test.add(h)
    except Exception as e:
        print('Error reading', u, e)

print(f'Checking {len(links_to_test)} links:')
all_ok = True
for link in sorted(links_to_test):
    try:
        res = urllib.request.urlopen('http://localhost:8080' + link)
        content = res.read().decode('utf-8')
        has_error = "This page didn't load" in content
        if has_error:
            print(f'  [ERROR PAGE DETECTED]: {link}')
            all_ok = False
        else:
            print(f'  [OK 200]: {link}')
    except Exception as e:
        print(f'  [FAILED]: {link} -> {e}')
        all_ok = False

if all_ok:
    print('ALL PRODUCT LINKS WORK PERFECTLY (NO ERRORS)!')
else:
    print('SOME LINKS RETURNED ERRORS.')
