document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('footerMenu');
    if (container) {
        var content = `
          <div class="row">
              <div class="col" style="text-align: left; font-size:12px;">
                  <p>API</p>
                  <a href="https://archive.gd.edu.kg/sitemap.xml">Sitemap</a><br>
                  <a href="https://archive.gd.edu.kg/info.json">Feed</a><br>
              </div>
          </div>
        `;
        container.innerHTML = content;
    } else {
        console.error('Container not found. Make sure the div with id "footerMenu" exists.');
    }
});
