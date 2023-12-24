$('#burger').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('change');
    $('.mobile-menu').toggleClass('mobile-menu-open');
    $('.mobile-back').toggleClass('menu_on');
    $('.mobile-back').toggleClass('menu_off');
})
$(document).ready(function() {
    $.ajax({
        url: 'https://archive.gd.edu.kg/info.json',
        type: 'GET',
        dataType: 'json',
        success: function(jsonData) {
            const jsonCount = jsonData.length;
            document.getElementById('preprint_count').innerHTML = jsonCount;
            function truncateAbstract(abstract) {
                var words = abstract.split(' ');
                if (words.length > 35) {
                    return words.slice(0, 35).join(' ') + '...';
                }
                return abstract;
            }
            const lineBreak = `<HR>`;
            for (var i = Math.min(5, jsonCount) - 1; i >= 0; i--) {
                var paper = jsonData[i];
                var title = paper.title;
                var url = paper.url;
                var subject = paper.subject;
                var publication_date = paper.publication_date;
                var abstract = truncateAbstract(paper.abstract);
                var htmlCode = `
                    <div class="col-12 article-meta np">
                        <div class="article-tag">
                            ${subject}
                        </div>
                        <div class="article-date">
                            ${publication_date}
                        </div>
                    </div>
                    <div class="article-title col-12 np">
                        <a href="${url}">
                            ${title}
                        </a>
                    </div>
                    <div class="article-abstract">
                        ${abstract}
                    </div>
                `;
                if (i > 0) {
                    htmlCode += '<hr>';
                }
                $('#researchPapersContainer').append(htmlCode);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching JSON:', status, error);
        }
    });
});
function isAuthorMatch(authors, input) {
    const lowerInput = input.toLowerCase();
    return authors.some(author => {
        const lowerAuthor = author.toLowerCase();
        return lowerAuthor.includes(lowerInput) || lowerInput.includes(lowerAuthor);
    });
}
async function showInput() {
    event.preventDefault();
    var searchQuery = document.getElementById('searchQuery').value;
    var subject = document.getElementById('subject').value;
    var author = document.getElementById('author').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    try {
        var response = await fetch('https://archive.gd.edu.kg/info.json');
        var jsonData = await response.json();
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        return;
    }
    var filteredData = jsonData.filter(function (paper) {
        if (searchQuery || subject || author || startDate || endDate) {
            return (
                (searchQuery === '' || (paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        paper.url.includes(searchQuery) || 
                                        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        paper.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
                                    )) &&
                (subject === '' || paper.subject === subject) &&
                (author === '' || isAuthorMatch(paper.authors, author)) &&
                (startDate === '' || new Date(paper.publication_date) >= new Date(startDate)) &&
                (endDate === '' || new Date(paper.publication_date) <= new Date(endDate))
            );
        }
    });

    filteredData.sort((a, b) => parseInt(b.url.substring(26, 40), 10) - parseInt(a.url.substring(26, 40), 10));
    var sortOption = document.getElementById('sortOption').value;
    if (sortOption === 'asc') {
        filteredData.sort((a, b) => parseInt(a.url.substring(26, 40), 10) - parseInt(b.url.substring(26, 40), 10));
    }
    var resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    if (filteredData.length === 0) {
            resultsContainer.innerHTML = '<p><i>Sorry, your query produced no results.</i></p>';
    } else {
        resultsContainer.innerHTML = `
            <p><i>Found ${filteredData.length} result(s).</i></p>
        `;
        filteredData.forEach(function (paper) {
            // Truncate abstract to 100 words
            var truncatedAbstract = paper.abstract.split(' ').slice(0, 75).join(' ');
            truncatedAbstract += truncatedAbstract.length < paper.abstract.length ? '...' : '';
            var preprintID = paper.url.substring(8);
            var resultDiv = document.createElement('li');
            var authorsString = paper.authors.join(', ');
            resultDiv.innerHTML = `
                <p>
                <a href="${paper.url}">${preprintID}</a>&nbsp;&nbsp;
                <span class="article-tag">${paper.subject}</span> (${paper.version})
                </p>
                <b><p>${paper.title}</p></b>
                <p><b>Submission date</b>: ${paper.publication_date}</p>
                <p><b>Author</b>: ${authorsString}</p> 
                <p><b>Abstract</b>: ${truncatedAbstract}</p>
                <hr>
            `;
            resultsContainer.appendChild(resultDiv);
        });
    }
}
