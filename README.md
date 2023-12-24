# Research Papers

```javascript
const axios = require('axios');
const fs = require('fs');

const url = 'https://archive.gd.edu.kg/info.json';

axios.get(url)
  .then(response => {
    const jsonData = response.data;
    const markdownContent = generateMarkdown(jsonData);
    fs.writeFileSync('README.md', markdownContent);
    console.log('README.md generated successfully.');
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  });

function generateMarkdown(data) {
  let markdown = '# Research Papers\n\n';
  
  data.forEach(paper => {
    markdown += `## ${paper.title}\n\n`;
    markdown += `**Version:** ${paper.version}\n\n`;
    markdown += `**Authors:** ${paper.authors.join(', ')}\n\n`;
    markdown += `**Publication Date:** ${paper.publication_date}\n\n`;
    markdown += `**Keywords:** ${paper.keywords.join(', ')}\n\n`;
    markdown += `**Abstract:** ${paper.abstract}\n\n`;
    markdown += `**Subject:** ${paper.subject}\n\n`;
    markdown += `[Read More](${paper.url})\n\n`;
  });

  return markdown;
}
```
