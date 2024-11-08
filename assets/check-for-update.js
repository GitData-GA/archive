function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        preprintID: urlParams.get('preprintID'),
        version: urlParams.get('version')
    };
}
async function fetchJSONData() {
    const response = await fetch('https://archive.gd.edu.kg/info.json');
    return await response.json();
}
function extractPreprintID(url) {
    const match = url.match(/https:\/\/archive\.gd\.edu\.kg\/(\d+)/);
    return match ? match[1] : null;
}
async function checkForUpdate() {
    const { preprintID, version } = getQueryParams();
    if (preprintID === null & version === null) {
        document.getElementById('update-message').innerHTML = `<h2 style="font-family: Afacad_Bold; font-size: 20px; text-align: center;">This page allows you to verify the latest available version of a specific preprint document by entering two key pieces of information: the preprint ID and the version number.<br>Example: https://archive.gd.edu.kg/check-for-update?preprintID=yyyymmddhhmmss&version=Version 1</h2>`;
        document.getElementById('statusImg').innerHTML = `<svg viewBox="0 0 117 117" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <desc></desc> <defs></defs> <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"> <g fill-rule="nonzero" id="info"> <path d="M58.5,116.6 C90.5,116.6 116.5,90.6 116.5,58.6 C116.5,26.6 90.5,0.6 58.5,0.6 C26.5,0.6 0.4,26.6 0.4,58.6 C0.4,90.6 26.5,116.6 58.5,116.6 Z M58.5,8.6 C86,8.6 108.4,31 108.4,58.5 C108.4,86 86,108.4 58.5,108.4 C31,108.4 8.6,86 8.6,58.5 C8.6,31 31,8.6 58.5,8.6 Z" fill="#1b86b9" id="Shape"></path> <path d="M45.1,84.2 C42.8,84.2 41,86 41,88.3 C41,90.6 42.8,92.4 45.1,92.4 L72,92.4 C74.3,92.4 76.1,90.6 76.1,88.3 C76.1,86 74.3,84.2 72,84.2 L62.6,84.2 L62.6,48.1 C62.6,45.8 60.8,44 58.5,44 L45.1,44 C42.8,44 41,45.8 41,48.1 C41,50.4 42.8,52.2 45.1,52.2 L54.5,52.2 L54.5,84.2 L45.1,84.2 Z" fill="#1b86b9" id="Shape"></path> <circle cx="57.6" cy="30.6" fill="#1b86b9" id="Oval" r="6.6"></circle> </g> </g> </g></svg>`;
        return;
    }
    const data = await fetchJSONData();
    const matchedPreprints = data.filter(item => extractPreprintID(item.url) === preprintID);
    const matchingVersion = matchedPreprints.find(item => item.version === version);
    matchedPreprints.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
    if (matchedPreprints.length === 0 || !matchingVersion) {
        document.getElementById('update-message').innerHTML = `<h2 style="font-family: Afacad_Bold; font-size: 20px; text-align: center;">No document found. Please double-check your query.<br>Your query detail:<br>Preprint ID: ${preprintID}<br>Version: ${version}</h2>`;
        document.getElementById('statusImg').innerHTML = `<svg viewBox="0 0 117 117" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <desc></desc> <defs></defs> <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"> <g fill-rule="nonzero" id="cancel"> <path d="M58.5,116.6 C90.5,116.6 116.6,90.6 116.6,58.5 C116.6,26.4 90.5,0.4 58.5,0.4 C26.5,0.4 0.4,26.5 0.4,58.5 C0.4,90.5 26.5,116.6 58.5,116.6 Z M58.5,8.6 C86,8.6 108.4,31 108.4,58.5 C108.4,86 86,108.4 58.5,108.4 C31,108.4 8.6,86 8.6,58.5 C8.6,31 31,8.6 58.5,8.6 Z" fill="#1b86b9" id="Shape"></path> <path d="M36.7,79.7 C37.5,80.5 38.5,80.9 39.6,80.9 C40.7,80.9 41.7,80.5 42.5,79.7 L58.5,63.7 L74.5,79.7 C75.3,80.5 76.3,80.9 77.4,80.9 C78.5,80.9 79.5,80.5 80.3,79.7 C81.9,78.1 81.9,75.5 80.3,73.9 L64.3,57.9 L80.3,41.9 C81.9,40.3 81.9,37.7 80.3,36.1 C78.7,34.5 76.1,34.5 74.5,36.1 L58.5,52.1 L42.5,36.1 C40.9,34.5 38.3,34.5 36.7,36.1 C35.1,37.7 35.1,40.3 36.7,41.9 L52.7,57.9 L36.7,73.9 C35.1,75.5 35.1,78.1 36.7,79.7 Z" fill="#ff0000" id="Shape"></path> </g> </g> </g></svg>`;
        return;
    }
    const latestVersion = matchedPreprints[0];
    const isLatest = latestVersion.version === version;
    const updateMessage = isLatest 
        ? `<h2 style="font-family: Afacad_Bold; font-size: 20px; text-align: center;">You are viewing the latest version of the document.</h2>` 
        : `<h2 style="font-family: Afacad_Bold; font-size: 20px; text-align: center;">You are viewing ${version.toLowerCase()} of the document, which is not the latest version.</h2>`;
    const updateStatusImg = isLatest 
        ? `<svg viewBox="0 0 117 117" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <desc></desc> <defs></defs> <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"> <g fill-rule="nonzero" id="correct"> <path d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z" fill="#17AB13" id="Shape"></path> <path d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z" fill="#1b86b9" id="Shape"></path> </g> </g> </g></svg>` 
        : `<svg viewBox="0 0 22 22" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" id="svg2" version="1.1" inkscape:version="0.92.1 r15371" sodipodi:docname="dark_warning.svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs id="defs4"> <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="16" y1="29.999973" x1="16" id="linearGradient4144" xlink:href="#linearGradient4155" inkscape:collect="always" gradientTransform="matrix(1.66667 0 0 -1.66667 -15.667 1064.696)"></linearGradient> <linearGradient inkscape:collect="always" id="linearGradient4155"> <stop style="stop-color:#fcd994;stop-opacity:1" offset="0" id="stop4157"></stop> <stop style="stop-color:#fff6e1;stop-opacity:1" offset="1" id="stop4159"></stop> </linearGradient> </defs> <sodipodi:namedview id="base" pagecolor="" bordercolor="#1b86b9" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="22.4" inkscape:cx="-8.3436117" inkscape:cy="10.155389" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="true" inkscape:showpageshadow="false" borderlayer="true" inkscape:window-width="1884" inkscape:window-height="1051" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="1" units="px"> <sodipodi:guide position="2,20.000017" orientation="18,0" id="guide4085" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="2,2.0000174" orientation="0,18" id="guide4087" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="20,2.0000174" orientation="-18,0" id="guide4089" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="20,20.000017" orientation="0,-18" id="guide4091" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="3,19.000017" orientation="16,0" id="guide4093" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="3,3.0000174" orientation="0,16" id="guide4095" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="19,3.0000174" orientation="-16,0" id="guide4097" inkscape:locked="false"></sodipodi:guide> <sodipodi:guide position="19,19.000017" orientation="0,-16" id="guide4099" inkscape:locked="false"></sodipodi:guide> <inkscape:grid type="xygrid" id="grid4101"></inkscape:grid> </sodipodi:namedview> <metadata id="metadata7"> <rdf:rdf> <cc:work> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type> <dc:title></dc:title> <dc:creator> <cc:agent> <dc:title>Timothée Giet</dc:title> </cc:agent> </dc:creator> <dc:date>2017</dc:date> <cc:license rdf:resource="http://creativecommons.org/licenses/by-sa/4.0/"></cc:license> </cc:work> <cc:license rdf:about="http://creativecommons.org/licenses/by-sa/4.0/"> <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"></cc:permits> <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"></cc:permits> <cc:requires rdf:resource="http://creativecommons.org/ns#Notice"></cc:requires> <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution"></cc:requires> <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"></cc:permits> <cc:requires rdf:resource="http://creativecommons.org/ns#ShareAlike"></cc:requires> </cc:license> </rdf:rdf> </metadata> <g inkscape:label="Capa 1" inkscape:groupmode="layer" id="layer1" transform="translate(0 -1030.362)"> <path style="fill:#1b86b9;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m11 1032.362-10 18h20zm0 2 8 15H3z" id="path839" inkscape:connector-curvature="0" sodipodi:nodetypes="cccccccc"></path> <path style="fill:#ffa200;fill-opacity:.94117647;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M10 1046.362h2v2h-2z" id="path844" inkscape:connector-curvature="0"></path> <path style="fill:#ffa200;fill-opacity:.94117647;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M10 1045.362h2v-6h-2z" id="path846" inkscape:connector-curvature="0" sodipodi:nodetypes="ccccc"></path> </g> </g></svg>`;
    document.getElementById('update-message').innerHTML = updateMessage;
    document.getElementById('statusImg').innerHTML = updateStatusImg;
    var resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = `<p>For more details, see all the available versions below:</p>`; 
    matchedPreprints.forEach(function (paper) {
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
checkForUpdate();
