function updateUrl() {
    if (window.location.hash === '' ||
        window.location.href.split('#')[1] === '' ||
        window.location.href.indexOf('#') === -1) {
        window.location.hash = '/';
    }
}

function reloadData() {
    console.log('Reload From Server');
}

function initRouter() {
    window.addEventListener('load', updateUrl);
    window.addEventListener('load', reloadData);
    window.addEventListener('hashchange', updateUrl);
}

export default initRouter;
