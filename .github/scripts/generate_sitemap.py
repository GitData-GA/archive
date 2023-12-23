import os
from datetime import datetime

def calculate_priority(level):
    base_priority = 1.0
    decay_factor = 0.9
    return base_priority * (decay_factor ** level)

def generate_sitemap():
    sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_footer = '</urlset>'

    urls = []

    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') or file.endswith('.pdf') and not file.endswith('404.html'):
                file_path = os.path.join(root, file)
                if file == "index.html":
                    file_path = os.path.dirname(file_path)
                file_url = f'https://arxiv.gd.edu.kg/{file_path[2:]}/'
                if file.endswith('.pdf'):
                    file_url = file_url.rstrip('/')
                if file_url == "https://arxiv.gd.edu.kg//":
                    file_url = "https://arxiv.gd.edu.kg/"
                file_priority = calculate_priority(file_path.count('/'))
                last_modified = datetime.utcnow().replace(microsecond=0).isoformat() + "+00:00"
                urls.append(f'  <url>\n    <loc>{file_url}</loc>\n    <lastmod>{last_modified}</lastmod>\n    <priority>{file_priority:.2f}</priority>\n  </url>')

    sitemap_content = '\n'.join(urls)

    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(f'{sitemap_header}{sitemap_content}\n{sitemap_footer}')

if __name__ == '__main__':
    generate_sitemap()
