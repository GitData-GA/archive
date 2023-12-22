import os
import json
from bs4 import BeautifulSoup

def extract_info_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    title = soup.find('meta', {'name': 'citation_title'})['content'] if soup.find('meta', {'name': 'citation_title'}) else 'Title not found'
    
    # Extracting multiple authors
    authors = [meta['content'] for meta in soup.find_all('meta', {'name': 'citation_author'})]
    
    publication_date = soup.find('meta', {'name': 'citation_publication_date'})['content'] if soup.find('meta', {'name': 'citation_publication_date'}) else 'Publication date not found'
    abstract = soup.find('meta', {'name': 'description'})['content'] if soup.find('meta', {'name': 'description'}) else 'Abstract not found'
    url = soup.find('meta', {'property': 'og:url'})['content'] if soup.find('meta', {'property': 'og:url'}) else 'URL not found'

    return {'title': title, 'authors': authors, 'publication_date': publication_date, 'abstract': abstract, 'url': url}

def main():
    output_data = []

    # Scan through HTML files in the repository
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                    info = extract_info_from_html(html_content)
                    output_data.append(info)

    # Write the extracted information to a JSON file
    output_path = 'info.json'
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(output_data, json_file, indent=2)

if __name__ == '__main__':
    main()
