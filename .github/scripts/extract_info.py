import os
import json
import re
from bs4 import BeautifulSoup

def extract_info_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    title = soup.find('meta', {'name': 'citation_title'})
    title = title['content'] if title else 'Title not found'
    
    authors_meta = soup.find_all('meta', {'name': 'citation_author'})
    authors = []
    for author_meta in authors_meta:
        author_name_parts = author_meta['content'].split(', ')
        formatted_author_name = ' '.join(reversed(author_name_parts))
        authors.append(formatted_author_name)
    
    version = soup.find('meta', {'name': 'version'})
    version = version['content'] if version else 'Version not found'
    jsonID = soup.find('meta', {'name': 'jsonID'})
    jsonID = jsonID['content'] if jsonID else 'jsonID not found'
    publication_date = soup.find('meta', {'name': 'citation_publication_date'})
    publication_date = publication_date['content'] if publication_date else 'Publication date not found'
    abstract = soup.find('meta', {'name': 'description'})
    abstract = abstract['content'] if abstract else 'Abstract not found'
    side_block_sections = soup.find_all('div', {'class': 'side-block_section'})    
    subject = 'Subject not found'    
    for section in side_block_sections:
        span_head = section.find('span', {'class': 'head'})
        if span_head and span_head.get_text() == 'Subject':
            subject = section.find('li').get_text()
            break
    keywords = []    
    for section in side_block_sections:
        span_head = section.find('span', {'class': 'head'})
        if span_head and span_head.get_text() == 'Keywords':
            keywords_element = section.find('ul')
            if keywords_element:
                keywords = [keyword.strip() for keyword in keywords_element.get_text(separator='\n').split('\n') if keyword.strip()]
                break
    url = soup.find('meta', {'property': 'og:url'})
    url = url['content'] if url else 'URL not found'
    
    return {'jsonID': jsonID,
            'url': url,
            'title': title, 
            'subject': subject,
            'version': version, 
            'publication_date': publication_date,
            'authors': authors, 
            'keywords': keywords, 
            'abstract': abstract}

def main():
    output_data = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                    info = extract_info_from_html(html_content)
                    if all(value != 'jsonID not found' and value != 'Version not found' and value != 'Title not found' and value != 'Publication date not found' and value != 'Abstract not found' and value != 'Subject not found' and value != 'URL not found' for value in info.values()):
                        output_data.append(info)

    sorted_data = sorted(output_data, key=lambda x: x['jsonID'], reverse=True)

    with open('info.json', 'w') as json_file:
        json.dump(sorted_data, json_file)

if __name__ == '__main__':
    main()
