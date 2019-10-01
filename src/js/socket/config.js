import io from 'socket.io-client';
import chat from '../chat';

const socket = io('http://localhost:8000');

socket.on('UPDATE_MESSAGE', function (data) {
    if (data) {
        console.log(data);
        data.fromMe = data.from === window.state.user.username;
        chat.renderOneMessage(data);
    }
});

export default socket;
