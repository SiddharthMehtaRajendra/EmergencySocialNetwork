import io from 'socket.io-client';
import chat from '../chat';
import processMessage from '../lib/processMessage';

const socket = io('http://localhost:8000');

socket.on('UPDATE_MESSAGE', function (msg) {
    if (msg) {
        chat.renderOneMessage(processMessage(msg));
    }
});

export default socket;
