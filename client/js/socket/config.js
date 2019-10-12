import io from 'socket.io-client';
import chat from '../chat';
import processMessage from '../lib/processMessage';
import directory from '../directory';
import { SERVER_ADDRESS } from '../constant/serverInfo';
import Toast from '../lib/toast';

const socket = io(SERVER_ADDRESS);

socket.on('UPDATE_MESSAGE', function (msg) {
    const user = window.location.href.split('/').pop();
    console.log(user);
    if (user === msg.from || user === msg.to) {
        chat.renderOneMessage(processMessage(msg));
    } else {
        if (msg.to === 'public') {
            msg.from = '(Public Board) ' + msg.from;
        }
        const newMessage = msg.from + ':\r\n' + msg.content;
        Toast(newMessage, '#F41C3B');
    }
});

socket.on('AUTH_FAILED', function () {
    if (window.location.hash !== '#/') {
        console.log('Socket Auth Failed, Redirect');
        window.location.hash = '/join';
    }
});

socket.on('UPDATE_DIRECTORY', async function (data) {
    await directory.fetchData();
    if (window.location.hash === '#/directory') {
        await directory.render();
    }
});

export default socket;
