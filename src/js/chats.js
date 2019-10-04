
import '../style/chats.less';


function render() {
    document.getElementById('public-chat-entrance').addEventListener('click', function () {
        window.location.hash = '/chat/public';
    });
}

const chats = {
    render
};

export default chats;
