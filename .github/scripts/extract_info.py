import os
import json
import re
from bs4 import BeautifulSoup

def extract_info_from_html(html_content):
    # ... (unchanged)

def extract_numeric_version(version_str):
    # Extract numeric part from version string
    match = re.search(r'\d+', version_str)
    return int(match.group()) if match else 0

def custom_sort(entry):
    # Extract the 14-digit part of the URL
    url_digits = entry['url'][26:40]

    # Extract the numeric part of the version
    version = extract_numeric_version(entry['version'])

    # Return a tuple to use for sorting: (url_digits, -version)
    return (url_digits, -version)

def main():
    output_data = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                    info = extract_info_from_html(html_content)
                    if all(value != 'Version not found' and value != 'Title not found' and value != 'Publication date not found' and value != 'Abstract not found' and value != 'Subject not found' and value != 'URL not found' for value in info.values()):
                        output_data.append(info)

    # Sort using the custom_sort function
    output_data = sorted(output_data, key=custom_sort)

    with open('info.json', 'w') as json_file:
        json.dump(output_data, json_file, indent=2)

if __name__ == '__main__':
    main()
