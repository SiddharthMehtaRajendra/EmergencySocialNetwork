async function getHistoryMessage() {
    console.log('get messages');
}

async function render() {
    if (window.location.hash.indexOf('public') >= 0) {
        document.getElementById('single-chat-navbar-title').innerText = 'Public Wall';
    }
}

const chat = {
    render,
    getHistoryMessage
};

export default chat;
