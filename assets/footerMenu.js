document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('footerMenu');
    if (container) {
        var content = `
          <div class="row">
              <div class="col" style="text-align: left; font-size:12px;">
                  <p>API</p>
                  <a href="https://archive.gd.edu.kg/sitemap.xml">Sitemap</a><br>
                  <a href="https://archive.gd.edu.kg/check-for-update">Check for update</a><br>
                  <a href="https://archive.gd.edu.kg/info.json">Feed</a><br>
              </div>
              <div class="col" style="text-align: left; font-size:12px;">
                  <p>Policy</p>
                  <a href="https://www.gd.edu.kg/privacy-policy/" target="_blank">Privacy Policy</a><br>
                  <a href="https://www.gd.edu.kg/cookie-policy/" target="_blank">Cookie Policy</a><br>
              </div>
          </div>
        `;
        container.innerHTML = content;
    } else {
        console.error('Container not found. Make sure the div with id "footerMenu" exists.');
    }
});
