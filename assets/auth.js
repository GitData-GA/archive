document.addEventListener("DOMContentLoaded", function() {
    var msalConfig = {
        auth: {
            clientId: atob('MjdkNDIyYTctMGY4OS00MTQ0LWI4NGItNGU5ZmRmMzU0Yzdi'),                    
            authority: 'https://login.microsoftonline.com/gd.edu.kg',
            redirectUri: window.location.origin
        }
    };
    var msalApplication = new Msal.UserAgentApplication(msalConfig);

    document.getElementById('loginMobileLink').addEventListener('click', function(event) {
        event.preventDefault();
        msalApplication.loginRedirect();
    });

    document.getElementById('loginDesktopLink').addEventListener('click', function(event) {
        event.preventDefault();
        msalApplication.loginRedirect();
    });

    document.getElementById('logoutMobileLink').addEventListener('click', function(event) {
        event.preventDefault();
        msalApplication.logout();
    });

    document.getElementById('logoutDesktopLink').addEventListener('click', function(event) {
        event.preventDefault();
        msalApplication.logout();
    });

    if (msalApplication.getAccount()) {
        var userName = msalApplication.getAccount().name;
        document.getElementById('loginMobile').innerHTML = `<a><img src="https://archive.gd.edu.kg/assets/user.svg" alt="user_img" height="16px" />&nbsp;${userName}</a>`;
        document.getElementById('loginDesktop').innerHTML = `<a class="nav-menu" style="display: flex; align-items: center;"><img src="https://archive.gd.edu.kg/assets/user.svg" alt="user_img" height="16px" />&nbsp;${userName}</a>`;
        document.getElementById('logoutMobile').style.display = 'inline-block';
        document.getElementById('logoutDesktop').style.display = 'inline-block';
    }
});
