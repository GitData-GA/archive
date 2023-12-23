import os

def generate_sitemap():
    sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_footer = '</urlset>'

    urls = []

    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') or file.endswith('.pdf'):
                file_path = os.path.join(root, file)
                file_url = f'https://arxiv.gd.edu.kg/{file_path[2:]}'
                urls.append(f'  <url>\n    <loc>{file_url}</loc>\n  </url>')

    sitemap_content = '\n'.join(urls)

    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(f'{sitemap_header}{sitemap_content}\n{sitemap_footer}')

if __name__ == '__main__':
    generate_sitemap()
