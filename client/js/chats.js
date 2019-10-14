import '../style/chats.less';
import Chats from '../view/chats.html';

function render() {
    const app = document.getElementById('app');
    app.innerHTML = Chats;
    document.getElementById('public-chat-entrance').addEventListener('click', function () {
        window.location.hash = '/chat/public';
    });
    document.getElementById('annie-chat').addEventListener('click', function () {
        window.location.hash = '/chat/annie';
    });
}

const chats = {
    render
};

export default chats;
