function previewHtml() {
    const outputCodeContent = document.getElementById('outputCode').value;
    const previewHtmlContent = `
        <center>
            <h1 style="color:red;font-size:15px;">
            This preview is for visual reference only. Links, PDF, and MathJax functionality may not work as this page hasn't been published. If you spot errors, please revise and regenerate the HTML code.
            </h1>
        </center>
        ${outputCodeContent}
    `;
    const previewWindow = window.open();
    previewWindow.document.write(previewHtmlContent);
}

function downloadHtml() {
    const outputCodeContent = document.getElementById('outputCode').value;
    const blob = new Blob([outputCodeContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'index.html';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function limitTextareaLength(textarea, maxLength) {
    var text = textarea.value;
    var words = text.split(/\s+/);

    if (words.length > maxLength) {
        // Truncate the text to the specified number of words
        var truncatedText = words.slice(0, maxLength).join(" ");
        textarea.value = truncatedText;
    }
}

function setID() {
    const date = new Date();
    const formattedTime = date.toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
    return formattedTime;
}

function getAuthors() {
    var authorsTextArea = document.getElementById('authorToFill');
    var authorsText = authorsTextArea.value.trim();
    var authorLines = authorsText.split('\n');
    var authors = [];
    for (var i = 0; i < authorLines.length; i++) {
        var authorDetails = authorLines[i].split(',').map(function (item) {
            return item.trim();
        });
        var lastName = authorDetails[0] || '';
        var firstName = authorDetails[1] || '';
        var orcid = authorDetails[2] || '';
        if (lastName || firstName || orcid) {
            authors.push({
                lastName: lastName,
                firstName: firstName,
                orcid: orcid
            });
        }
    }
    return authors;
}

function printAuthorsInfo() {
    var authors = getAuthors();
    var resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    for (var i = 0; i < authors.length; i++) {
        var authorInfo = 'Author ' + (i + 1) + ': ' +
            authors[i].firstName + ' ' + authors[i].lastName +
            ', ORCID: ' + authors[i].orcid;
        var paragraph = document.createElement('p');
        paragraph.textContent = authorInfo;
        resultContainer.appendChild(paragraph);
    }
}

function generateCitationAuthor() {
    var authors = getAuthors();
    var citationMeta = '';
    for (var i = 0; i < authors.length; i++) {
        citationMeta += `            <meta name="citation_author" content="${authors[i].lastName}, ${authors[i].firstName}">`;
        if (authors.length > 1 && i < authors.length - 1) {
            citationMeta += '\n';
        }
    }
    return citationMeta;
}

function generateInfoAuthor() {
    var authors = getAuthors();
    var infoAuthor = '';
    for (var i = 0; i < authors.length; i++) {
        if (authors[i].orcid != 'NA' && authors[i].orcid != null && authors[i].orcid != '') {
            infoAuthor += 
                   `<li>
                        <a href="https://orcid.org/${authors[i].orcid}" target="_blank" class="object-link">
                        <span>
                        <object type="image/svg+xml" data="https://archive.gd.edu.kg/assets/ID.svg" width="15px" height="15px" alt="ORCID"></object>
                        </span>
                        </a>
                        <span>${authors[i].firstName}&nbsp;${authors[i].lastName}</span>
                    </li>`
        }
        else {
            infoAuthor += `
                    <li>
                        <span>${authors[i].firstName}&nbsp;${authors[i].lastName}</span>
                    </li>`
        }
        if (authors.length > 1 && i < authors.length - 1) {
            infoAuthor += '\n';
        }
    }
    return infoAuthor;
}

function copyToClipboard() {
    var textarea = document.getElementById('outputCode');
    textarea.select();
    textarea.setSelectionRange(0, 9999999999999999999);
    document.execCommand('copy');
    textarea.setSelectionRange(0, 0);
    alert('Text copied to clipboard!');
}

function existingJournal() {
    var journalBookName = "";
    var journalBookURL = "";
    if (document.getElementById('journalBookName').value !== null && 
        document.getElementById('journalBookName').value !== "" && 
        document.getElementById('journalBookURL').value !== null &&
        document.getElementById('journalBookURL').value !== "") {
        journalBookName = document.getElementById('journalBookName').value;
        journalBookURL = document.getElementById('journalBookURL').value;
        var journalHTML = `
            <p>${journalBookName}: <a href="${journalBookURL}" target="_blank">${journalBookURL}</a></p>
        `;
        return journalHTML;
    }
    else {
        return ``;
    }
}

function multimediaToFill() {
    var relatedURL = "";
    if (document.getElementById('relatedURL').value !== null && 
        document.getElementById('relatedURL').value !== "") {
        relatedURL = document.getElementById('relatedURL').value;
        var relatedURLHTML = `
            <div class="side-block_section">
                <span class="head">Related Link</span>
                <ul>
                    <li>
                    <a href="${relatedURL}" target="_blank">${relatedURL}</a>
                    </li>
                </ul>
            </div>
        `;
        return relatedURLHTML;
    }
    else {
        return ``;
    }
}

function commentToFill() {
    var comment = "";
    if (document.getElementById('comment').value !== null && 
        document.getElementById('comment').value !== "") {
        comment = document.getElementById('comment').value;
        var commentHTML = `
            <div class="side-block_section">
                <span class="head">Comment</span>
                <ul>
                    <li>
                    <p>${comment}</p>
                    </li>
                </ul>
            </div>
        `;
        return commentHTML;
    }
    else {
        return ``;
    }
}

function getLicense() {
    var license = document.getElementById('licenseSelect').value;
    if (license == "CC BY") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else if (license == "CC BY-SA") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else if (license == "CC BY-NC") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else if (license == "CC BY-NC-SA") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else if (license == "CC BY-ND") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else if (license == "CC BY-NC-ND") {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 4.0</a>.
            </p>
        `
    }
    else {
        return `
            <p xmlns:cc="http://creativecommons.org/ns#" >
            This work is licensed under <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">${license} 1.0</a>.
            </p>
        `
    }
}

const preprintID = setID();
            
// Modify PDF
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
async function modifyPdf() {
var year = preprintID.slice(0, 4);
var month = preprintID.slice(4, 6);
var day = preprintID.slice(6, 8);
var hours = preprintID.slice(8, 10);
var minutes = preprintID.slice(10, 12);
var seconds = preprintID.slice(12, 14);
var date = new Date(year, month - 1, day, hours, minutes, seconds, 0);
var formattedDate = date.toISOString();
var keywordBag = [];
for (var i = 1; i <= 8; i++) {
    var keyword = document.getElementById('keyword' + i).value;
    if (keyword !== null && keyword !== "") {
        keywordBag.push(keyword);
    }
}
var authorPDFMeta = [];
var authorRaw = getAuthors();
for (var i = 0; i < authorRaw.length; i++) {
    authorPDFMeta.push(authorRaw[i].firstName + " " + authorRaw[i].lastName);
}
var authorPDF = authorPDFMeta.join(", ")
const fileInput = document.getElementById('fileInput');
const selectedFile = fileInput.files[0];
if (!selectedFile) {
    alert('Please select a PDF file before clicking "Process PDF".');
    return;
}
const existingPdfBytes = await selectedFile.arrayBuffer();
const pdfDoc = await PDFDocument.load(existingPdfBytes);
const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
const pages = pdfDoc.getPages();
const firstPage = pages[0];
const { width, height } = firstPage.getSize();
firstPage.drawText(`archive.gd.edu.kg/${preprintID}/`, {
    x: width / 16,
    y: height / 3.75,
    size: 23,
    font: timesRomanFont,
    color: rgb(0.6, 0.6, 0.6),
    rotate: degrees(90),
});
pdfDoc.setTitle(document.getElementById('titleToFill').value)
pdfDoc.setAuthor(authorPDF)
pdfDoc.setSubject(document.getElementById('subjectSelect').value)
pdfDoc.setKeywords(keywordBag)
pdfDoc.setProducer('GitData Archive')
pdfDoc.setCreator(`GitData Archive (https://archive.gd.edu.kg/${preprintID}/)`)
pdfDoc.setCreationDate(new Date(formattedDate))
pdfDoc.setModificationDate(new Date(formattedDate))
const pdfBytes = await pdfDoc.save();
download(pdfBytes, "v1.pdf", "application/pdf");
}

// Download PDF
function download(data, filename, type) {
const file = new Blob([data], { type: type });
const a = document.createElement("a");
const url = URL.createObjectURL(file);
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}, 0);
}

function generateHtmlCode() {
// Get user input value
var titleToFill = document.getElementById('titleToFill').value;
var abstractToFill = document.getElementById('abstractToFill').value;
var citationAuthor = generateCitationAuthor();
var subjectToFill = document.getElementById('subjectSelect').value;
var infoAuthor = generateInfoAuthor();
var keywordBag = [];
for (var i = 1; i <= 8; i++) {
    var keyword = document.getElementById('keyword' + i).value;
    if (keyword !== null && keyword !== "") {
        keywordBag.push(keyword);
    }
}
var keywordsString = keywordBag.join("<br>");
var citationFill = existingJournal();
var multimediaFill = multimediaToFill();
var commentFill = commentToFill();
var licenseFill = getLicense();

// Generate HTML code
var generatedHtml = 
`<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>GitData Archive - ${titleToFill}</title>
            <link rel="icon" type="image/x-icon" href="https://www.gd.edu.kg/images/logo-100-white.png">
            <link rel="canonical" href="https://archive.gd.edu.kg/${preprintID}/" />
            <meta name="version" content="Version 1">
            <meta name="keywords" content="${keywordBag}">
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-ELSZ3SFQ2D"><\/script>
            <script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-ELSZ3SFQ2D")<\/script>
            
            <!-- Citation -->
            <meta name="citation_title" content="${titleToFill}">
${citationAuthor}
            <meta name="citation_publication_date" content="${preprintID.substring(0, 4)}/${preprintID.substring(4, 6)}/${preprintID.substring(6, 8)}">
            <meta name="citation_journal_title" content="GitData Archive">
            <meta name="citation_volume" content="${preprintID.substring(0, 4)}">
            <meta name="citation_issue" content="${preprintID.substring(4, 6)}">
            <meta name="citation_pdf_url" content="https://archive.gd.edu.kg/${preprintID}/v1.pdf">
            
            <!-- Google / Search Engine Tags -->
            <meta itemprop="name" content="GitData Archive - ${titleToFill}">
            <meta name="description" content="${abstractToFill}">
            <meta itemprop="image" content="https://archive.gd.edu.kg/assets/bg.jpg">
            
            <!-- Facebook Meta Tags -->
            <meta property="og:url" content="https://archive.gd.edu.kg/${preprintID}/">
            <meta property="og:type" content="website">
            <meta property="og:title" content="GitData Archive - ${titleToFill}">
            <meta property="og:description" content="${abstractToFill}">
            <meta property="og:image" content="https://archive.gd.edu.kg/assets/bg.jpg">
            
            <!-- Twitter Meta Tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="GitData Archive - ${titleToFill}">
            <meta name="twitter:description" content="${abstractToFill}">
            <meta name="twitter:image" content="https://archive.gd.edu.kg/assets/bg.jpg">
            
            <!-- Style -->
            <link href="https://archive.gd.edu.kg/assets/app.css" rel="stylesheet">
            <link href="https://archive.gd.edu.kg/assets/bootstrap.min.css" rel="stylesheet">
            <link href="https://archive.gd.edu.kg/assets/custom.css" rel="stylesheet">

            <!-- JavaScript -->
            <script src="https://archive.gd.edu.kg/assets/jquery.min.js" type="text/javascript"><\/script>
            <script src="https://archive.gd.edu.kg/assets/footerMenu.js" type="text/javascript"><\/script>
            <script src="https://archive.gd.edu.kg/assets/headMenu.js" type="text/javascript"><\/script>
            <script src="https://mathjax.gd.edu.kg/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript" async><\/script>
            <script type="text/x-mathjax-config">
                init_mathjax = function() {
                    if (window.MathJax) {
                    // MathJax loaded
                        MathJax.Hub.Config({
                            TeX: {
                                equationNumbers: {
                                autoNumber: "AMS",
                                useLabelIds: true
                                }
                            },
                            tex2jax: {
                                inlineMath: [ ['$','$'] ],
                                displayMath: [ ['$$','$$'] ],
                                processEscapes: true,
                                processEnvironments: true
                            },
                            displayAlign: 'center',
                            CommonHTML: {
                                linebreaks: {
                                automatic: true
                                }
                            }
                        });
                
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    }
                }
                init_mathjax();
            <\/script>
        </head>
        <body>
        <div id="app">
            <nav role="navigation" class="mobile-menu">
                <div class="burger_container" id="burger">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                </div>
                <div id="mobileMenu" class="mobile-back menu_off">
                </div>
                <div class="logo-mobile">
                    <a href="https://archive.gd.edu.kg/">
                    <img src="https://archive.gd.edu.kg/assets/logo.svg" width="150px" alt="logo">
                    </a>
                </div>
                <script>
                    $('#burger').click(function (e) {
                        e.preventDefault();
                        $(this).toggleClass('change');
                        $('.mobile-menu').toggleClass('mobile-menu-open');
                        $('.mobile-back').toggleClass('menu_on');
                        $('.mobile-back').toggleClass('menu_off');
                    })
                <\/script>
            </nav>
            <nav class="pre-navbar">
                <div class="logo-background" style="display: flex; justify-content: center">
                    <a href="https://archive.gd.edu.kg/" style="display: flex; align-items: center">
                    <img src="https://archive.gd.edu.kg/assets/logo.svg" width="170px" alt="logo">
                    </a>
                </div>
                <div id="normalMenu" class="items-container">
                </div>
            </nav>
            <nav class="post-navbar">
            </nav>
            <div class="grid article-page d-flex">
                <div class="article-content col main-block">
                    <div class="title">
                        <b><h1>${titleToFill}</h1></b>
                    </div>
                    <div class="notation">This article is a preprint and has not been peer-reviewed.</div>
                    <br>
                    <div class="doi" style="margin-bottom: 10px">
                        <span><b>For citation: </b></span><br>
                        <p>GitData Archive: <a href="https://archive.gd.edu.kg/${preprintID}/">https://archive.gd.edu.kg/${preprintID}/</a></p>
${citationFill}
                    </div>
                    <div class="abstract">
                        <span><b>Abstract: </b></span><br>
                        <p>${abstractToFill}</p>
                    </div>
                    <div class="preview">
                        <span><b>Preview: </b></span><br>
                        <a href="https://pdfviewer.gd.edu.kg/web/viewer?file=https://archive.gd.edu.kg/${preprintID}/v1.pdf" target="_blank">Preview in a new window</a></br>
                        <iframe src="https://pdfviewer.gd.edu.kg/web/viewer?file=https://archive.gd.edu.kg/${preprintID}/v1.pdf" loading="lazy" width="100%" height="500" frameBorder="0" alt="pdf preview"></iframe>
                    </div>
                    <div class="license">
                        <span><b>License: </b></span><br>
${licenseFill}
                    </div>
                    <br><br>
                </div>
                <div class="article-info col side-block">
                    <div class="block-head">
                        <h2>Information</h2>
                    </div>
                    <div class="side-block_container">
                        <div class="side-block_section">
                            <span class="head">Version</span>
                            <ul>
                                <li>
                                    <p>Version 1</p>
                                </li>
                            </ul>
                        </div>
                        <div class="side-block_section">
                            <span class="head">Submission Date (yyyy/mm/dd)</span>
                            <p>${preprintID.substring(0, 4)}/${preprintID.substring(4, 6)}/${preprintID.substring(6, 8)}</p>
                        </div>
                        <div class="side-block_section">
                            <span class="head">Author</span>
                            <ul>
 ${infoAuthor}
                            </ul>
                        </div>
                        <div class="side-block_section">
                            <span class="head">Subject</span>
                            <ul>
                                <li>${subjectToFill}</li>
                            </ul>
                        </div>
                        <div class="side-block_section">
                            <span class="head">Keywords</span>
                            <ul>
                                <li>
                                    ${keywordsString}
                                </li>
                            </ul>
                        </div>
${multimediaFill}
${commentFill}
                        <div class="side-block_section">
                            <span class="head">Download</span>
                            <ul>
                                <li>
                                <a href="https://archive.gd.edu.kg/${preprintID}/v1.pdf" target="_blank">
                                    <button class="fulltext"><span class="ext">PDF</span><span class="label">Full Text</span></button>
                                </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div id="footerMenu" class="container"></div>
                <div class="col-5 np">
                    &copy; <script type="text/JavaScript"> document.write(new Date().getFullYear()) <\/script> GitDat Archive
                </div>
            </div>
        </div>
    </body>
</html>`;

    // Display generated HTML in the text area
    document.getElementById('outputCode').value = generatedHtml;
}
