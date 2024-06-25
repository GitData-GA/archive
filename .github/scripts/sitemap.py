import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from datetime import datetime

root_url = "https://archive.gd.edu.kg/"
sitemap_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
sitemap_footer = '</urlset>'

def get_priority(level, is_latest_pdf=False):
    if level == 1:
        return 1.0
    elif is_latest_pdf:
        return get_priority(level - 1)
    else:
        return 0.9 ** (level - 1)

def crawl(url, level=1, visited=set()):
    if url in visited:
        return []
    visited.add(url)

    response = requests.get(url)
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    urls = []
    latest_pdf = ""

    for link in soup.find_all("a"):
        href = link.get("href")
        if not href:
            continue
        full_url = urljoin(url, href)

        # Normalize URL if it ends with "index.html"
        if full_url.endswith("index.html"):
            full_url = full_url.replace("index.html", "")

        if full_url.endswith(".html") or full_url.endswith(".pdf"):
            urls.append((full_url, level))
            if full_url.endswith(".pdf"):
                if not latest_pdf or full_url > latest_pdf:
                    latest_pdf = full_url

        if level < 4:
            urls.extend(crawl(full_url, level + 1, visited))

    # Assign priorities
    result = [(u, get_priority(l, u == latest_pdf)) for u, l in urls]
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
    urls = crawl(root_url)
    sitemap_content = generate_sitemap(urls)
    
    with open('sitemap.xml', 'w') as sitemap_file:
        sitemap_file.write(sitemap_content)
    
    print("Sitemap generated successfully.")

if __name__ == "__main__":
    main()
