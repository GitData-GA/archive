import os
import json
from bs4 import BeautifulSoup

def extract_info_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    title = soup.find('meta', {'name': 'citation_title'})
    title = title['content'] if title else 'Title not found'
    authors = [meta['content'] for meta in soup.find_all('meta', {'name': 'citation_author'})]
    publication_date = soup.find('meta', {'name': 'citation_publication_date'})
    publication_date = publication_date['content'] if publication_date else 'Publication date not found'
    abstract = soup.find('meta', {'name': 'description'})
    abstract = abstract['content'] if abstract else 'Abstract not found'
    side_block_sections = soup.find_all('div', {'class': 'side-block_section'})
    side_block_sections = soup.find_all('div', {'class': 'side-block_section'})    
    subject = 'Subject not found'    
    for section in side_block_sections:
        span_head = section.find('span', {'class': 'head'})
        if span_head and span_head.get_text() == 'Subject':
            subject = section.find('li').get_text()
            break
    url = soup.find('meta', {'property': 'og:url'})
    url = url['content'] if url else 'URL not found'
    return {'title': title, 'authors': authors, 'publication_date': publication_date, 'abstract': abstract, 'subject': subject, 'url': url}

def main():
    output_data = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                    info = extract_info_from_html(html_content)
                    if all(value != 'Title not found' and value != 'Publication date not found' and value != 'Abstract not found' and value != 'Subject not found' and value != 'URL not found' for value in info.values()):
                        output_data.append(info)
    with open('info.json', 'w') as json_file:
        json.dump(output_data, json_file, indent=2)

if __name__ == '__main__':
    main()
