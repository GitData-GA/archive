import os
from datetime import datetime

sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
sitemap_footer = '</urlset>'

def get_priority(level, is_latest_pdf=False):
    if level == 1:
        return 1.0
    elif is_latest_pdf:
        return get_priority(level - 1)
    else:
        return 0.9 ** (level - 1)

def crawl(root_dir, level=1):
    urls = []
    latest_pdfs = {}

    for root, _, files in os.walk(root_dir):
        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, root_dir)
            url = f"https://archive.gd.edu.kg/{relative_path.replace(os.sep, '/')}"
            
            # Normalize URL if it ends with "index.html"
            if url.endswith("index.html"):
                url = url.replace("index.html", "")

            if url.endswith(".html") or url.endswith(".pdf"):
                urls.append((url, level))
                if url.endswith(".pdf"):
                    parent_dir = os.path.dirname(relative_path)
                    if parent_dir not in latest_pdfs or file > latest_pdfs[parent_dir]:
                        latest_pdfs[parent_dir] = file

    # Assign priorities
    result = []
    for url, lvl in urls:
        relative_path = os.path.relpath(url, "https://archive.gd.edu.kg/").replace('/', os.sep)
        parent_dir = os.path.dirname(relative_path)
        is_latest_pdf = url.endswith(latest_pdfs.get(parent_dir, ""))
        priority = get_priority(lvl, is_latest_pdf)
        result.append((url, priority))

    return result

def generate_sitemap(urls):
    sitemap_content = ""
    lastmod = datetime.utcnow().isoformat() + "+00:00"
    
    for url, priority in urls:
        sitemap_content += (
            "  <url>\n"
            f"    <loc>{url}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <priority>{priority:.2f}</priority>\n"
            "  </url>\n"
        )

    return f"{sitemap_header}{sitemap_content}{sitemap_footer}"

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    urls = crawl(root_dir)
    sitemap_content = generate_sitemap(urls)
    
    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(sitemap_content)
    
    print("Sitemap generated successfully.")

if __name__ == "__main__":
    main()
