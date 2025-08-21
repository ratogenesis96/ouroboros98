// js/navigation.js
function navigateTo(page) {
    window.location.href = page;
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user && !window.location.pathname.endsWith('index.html')) {
        navigateTo('login.html');
    }
    return user;
}

function logout() {
    localStorage.removeItem('currentUser');
    navigateTo('index.html');
}
