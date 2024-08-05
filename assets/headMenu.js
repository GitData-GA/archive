document.addEventListener('DOMContentLoaded', function () {
    var normal = document.getElementById('normalMenu');
    if (normal) {
        var content = `
                    <div id="normalMenu" class="menu-holder">
                        <a class="nav-menu" href="https://archive.gd.edu.kg/about/">About</a>
                        <a class="nav-menu" href="https://archive.gd.edu.kg/terms/">Terms</a>
                        <a class="nav-menu" href="https://archive.gd.edu.kg/submit/">Submit</a>
                        <div id="loginDesktop" style="display: inline-block;">
                            <a class="nav-menu" href="#" id="loginDesktopLink" style="display: flex; align-items: center;">
                                <img src="https://archive.gd.edu.kg/assets/lock.svg" alt="lock_img" height="16px" />&nbsp;Login
                            </a>
                        </div>
                        <div id="logoutDesktop" style="display: none;">
                            <a class="nav-menu" href="#" id="logoutDesktopLink" style="display: flex; align-items: center;">
                                <img src="https://archive.gd.edu.kg/assets/logout.svg" alt="logout_img" height="16px" />&nbsp;Logout
                            </a>
                        </div>
                    </div>
        `;
        normal.innerHTML = content;
    } else {
        console.error('Container not found. Make sure the div with id "normalMenu" exists.');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var mobile = document.getElementById('mobileMenu');
    if (mobile) {
        var content = `
                <ul>
                    <li><a href="https://archive.gd.edu.kg/about/">About</a></li>
                    <li><a href="https://archive.gd.edu.kg/terms/">Terms</a></li>
                    <li><a href="https://archive.gd.edu.kg/submit/">Submit</a></li>
                    <li id="loginMobile">
                        <a href="#" id="loginMobileLink">
                            <img src="https://archive.gd.edu.kg/assets/lock.svg" alt="lock_img" height="16px" />&nbsp;Login
                        </a>
                    </li>
                    <li id="logoutMobile" style="display: none;">
                        <a href="#" id="logoutMobileLink">
                            <img src="https://archive.gd.edu.kg/assets/logout.svg" alt="logout_img" height="16px" />&nbsp;Logout
                        </a>
                    </li>
                </ul>
        `;
        mobile.innerHTML = content;
    } else {
        console.error('Container not found. Make sure the div with id "mobileMenu" exists.');
    }
});

async function fetchTraceData() {
    const response = await fetch('https://archive.gd.edu.kg/cdn-cgi/trace');
    const text = await response.text();
    const lines = text.split('\n');
    const data = {};

    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key) {
            data[key.trim()] = value.trim();
        }
    });

    return data;
}

async function downloadFile(url) {
    document.getElementById("downloadButton").disabled = true;
    document.getElementById("downloadLoading").style.visibility = "visible";
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
    const segments = url.split('/');
    const timestamp = segments[segments.length - 2];
    const filename = segments[segments.length - 1];
    const newFilename = timestamp + '_' + filename;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const traceData = await fetchTraceData();
        const ip = traceData.ip;
        const utcTime = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC');
        const message = `[${filename}] Accessed by ${ip} at ${utcTime}.`;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        pages.forEach((page, index) => {
            if (index === 0) return;
            const { width, height } = page.getSize();
            page.drawText(message, {
                x: width / 16,
                y: height / 4,
                size: 11,
                font: timesRomanFont,
                color: rgb(0.6, 0.6, 0.6),
                rotate: degrees(90),
            });
        });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = blobUrl;
        anchor.download = newFilename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
        document.getElementById("downloadButton").disabled = false;
        document.getElementById("downloadLoading").style.visibility = "hidden";
    } catch (error) {
        console.error('Error downloading or modifying file:', error);
        document.getElementById("downloadButton").disabled = false;
        document.getElementById("downloadLoading").style.visibility = "hidden";
    }
}
