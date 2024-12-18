import os
from datetime import datetime

def calculate_priority(level, is_latest_pdf=False):
    base_priority = 1.0
    decay_factor = 0.8
    if is_latest_pdf:
        return base_priority * (decay_factor ** (level - 1))
    return base_priority * (decay_factor ** level)

def generate_sitemap():
    sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_footer = '</urlset>'

    urls = []
    latest_pdfs = {}

    # Identify the latest PDFs in each preprint ID
    for root, dirs, files in os.walk('.'):  
        pdfs_in_dir = [file for file in files if file.endswith('.pdf')]
        if pdfs_in_dir:
            latest_pdf = max(pdfs_in_dir)
            latest_pdfs[root] = latest_pdf

    for root, dirs, files in os.walk('.'):  
        for file in files:
            if (file.endswith('.html') or file.endswith('.pdf')) and not file.endswith('404.html'):
                file_path = os.path.join(root, file)

                # Normalize URL if it ends with "index.html"
                if file.endswith('index.html'):
                    file_path = os.path.dirname(file_path)

                file_url = f'https://archive.gd.edu.kg/{file_path[2:]}'.replace('\\', '/')
                if file.endswith('.html') or file.endswith('.pdf'):
                    file_url = file_url.rstrip('/')

                if file_url == "https://archive.gd.edu.kg":
                    file_url = "https://archive.gd.edu.kg/"

                if file.endswith('index.html') and file_url != 'https://archive.gd.edu.kg/':
                    file_url += '/'

                # Include only the latest PDF in each preprint ID
                if file.endswith('.pdf') and file != latest_pdfs.get(root):
                    continue

                level = file_path.count(os.sep)
                file_priority = calculate_priority(level)
                if file.endswith('.pdf') and file == latest_pdfs.get(root):
                    file_priority = calculate_priority(level, is_latest_pdf=True)
                last_modified = datetime.utcnow().replace(microsecond=0).isoformat() + "+00:00"
                urls.append((file_url, file_priority, last_modified))

    # Generate sitemap entries
    sitemap_entries = []
    for file_url, file_priority, last_modified in urls:
        sitemap_entries.append(
            f'  <url>\n    <loc>{file_url}</loc>\n    <lastmod>{last_modified}</lastmod>\n    <priority>{file_priority:.2f}</priority>\n  </url>'
        )

    sitemap_content = '\n'.join(sitemap_entries)

    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(f'{sitemap_header}{sitemap_content}\n{sitemap_footer}')

if __name__ == '__main__':
    generate_sitemap()
