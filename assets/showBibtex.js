async function openBibTex() {
    const bibtexDiv = document.getElementById('bibtexDiv');
    if (bibtexDiv.style.display === 'none' || bibtexDiv.style.display === '') {
        bibtexDiv.style.display = 'block';
        document.getElementById('show-bibtex').innerText = 'Hide BibTeX format';
    } else {
        bibtexDiv.style.display = 'none';
        document.getElementById('show-bibtex').innerText = 'Show BibTeX format';
    }
}

async function copyCode() {
    const codeContent = document.getElementById('codeBlock').innerText;
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = codeContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert('Code copied to clipboard!');
}
