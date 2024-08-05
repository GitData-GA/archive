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
