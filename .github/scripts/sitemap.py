import os
from datetime import datetime

def calculate_priority(level, is_latest_pdf=False):
    base_priority = 1.0
    decay_factor = 0.9
    if is_latest_pdf:
        return base_priority * (decay_factor ** (level - 1))
    return base_priority * (decay_factor ** level)

def generate_sitemap():
    sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_footer = '</urlset>'

    urls = []
    latest_pdfs = {}

    for root, dirs, files in os.walk('.'):
        for file in files:
            if (file.endswith('.html') or file.endswith('.pdf')) and not file.endswith('404.html'):
                file_path = os.path.join(root, file)
                
                # Normalize URL if it ends with "index.html"
                if file.endswith('index.html'):
                    file_path = os.path.dirname(file_path)
                
                file_url = f'https://archive.gd.edu.kg/{file_path[2:]}/'.replace('\\', '/')
                if file.endswith('.pdf') or file.endswith('.html'):
                    file_url = file_url.rstrip('/')
                
                if file_url == "https://archive.gd.edu.kg//":
                    file_url = "https://archive.gd.edu.kg/"
                
                parent_dir = os.path.dirname(file_path)
                if file.endswith('.pdf'):
                    if parent_dir not in latest_pdfs or file > latest_pdfs[parent_dir]:
                        latest_pdfs[parent_dir] = file

                level = file_path.count(os.sep)
                file_priority = calculate_priority(level)
                last_modified = datetime.utcnow().replace(microsecond=0).isoformat() + "+00:00"
                urls.append(f'  <url>\n    <loc>{file_url}</loc>\n    <lastmod>{last_modified}</lastmod>\n    <priority>{file_priority:.2f}</priority>\n  </url>')

    # Adjust priority for latest PDFs
    for i, url in enumerate(urls):
        for parent_dir, latest_pdf in latest_pdfs.items():
            if url.find(latest_pdf) != -1:
                urls[i] = urls[i].replace(f'<priority>{calculate_priority(os.path.dirname(latest_pdf).count(os.sep)):.2f}</priority>', f'<priority>{calculate_priority(os.path.dirname(latest_pdf).count(os.sep), is_latest_pdf=True):.2f}</priority>')

    sitemap_content = '\n'.join(urls)

    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(f'{sitemap_header}{sitemap_content}\n{sitemap_footer}')

if __name__ == '__main__':
    generate_sitemap()
