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
