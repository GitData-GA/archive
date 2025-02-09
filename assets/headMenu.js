document.addEventListener('DOMContentLoaded', function () {
    var normal = document.getElementById('normalMenu');
    if (normal) {
        var content = `
                    <div id="normalMenu" class="menu-holder">
                        <a class="nav-menu" href="https://archive.gd.edu.kg/about/">About</a>
                        <a class="nav-menu" href="https://archive.gd.edu.kg/terms/">Terms</a>
                        <a class="nav-menu" href="https://archive.gd.edu.kg/submit/">Submit</a>
                        <a class="nav-menu" href="https://portal.archive.gd.edu.kg/"><img src="https://archive.gd.edu.kg/assets/lock.svg" alt="lock_img" width="16px" height="16px" />&nbsp;Portal & Submit</a>
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
                    <li><a class="nav-menu" href="https://portal.archive.gd.edu.kg/"><img src="https://archive.gd.edu.kg/assets/lock.svg" alt="lock_img" width="16px" height="16px" />&nbsp;Portal & Submit</a></li>
                </ul>
        `;
        mobile.innerHTML = content;
    } else {
        console.error('Container not found. Make sure the div with id "mobileMenu" exists.');
    }
});
