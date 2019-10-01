import io from 'socket.io-client';
import chat from '../chat';
import dateFormat from '../lib/dateFormat';

const socket = io('http://localhost:8000');

socket.on('UPDATE_MESSAGE', function (data) {
    if (data) {
        data.fromMe = data.from === window.state.user.username;
        data.time = dateFormat(data.time, 'mm/dd HH:MM');
        data.status = window.state.userMap[data.from].status.toLowerCase();
        data.avatar = window.state.userMap[data.from].avatar;
        chat.renderOneMessage(data);
    }
});

export default socket;
