
import '../style/chats.less';
import Chats from '../view/chats.html';

function render() {
    const app = document.getElementById('app');
    app.innerHTML = Chats;
    document.getElementById('public-chat-entrance').addEventListener('click', function () {
        window.location.hash = '/chat/public';
    });
}

const chats = {
    render
};

export default chats;
