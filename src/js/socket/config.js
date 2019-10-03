import io from 'socket.io-client';
import chat from '../chat';
import processMessage from '../lib/processMessage';
import directory from '../directory';
import { SERVER_ADDRESS } from '../constant/serverInfo';

const socket = io(SERVER_ADDRESS);

socket.on('UPDATE_MESSAGE', function (msg) {
    if (msg && window.location.hash.indexOf('#/chat/') >= 0) {
        chat.renderOneMessage(processMessage(msg));
    }
});

socket.on('AUTH_FAILED', function () {
    window.location.hash = '/join';
});

socket.on('UPDATE_DIRECTORY', async function (data) {
    await directory.fetchData();
    if (window.location.hash === '#/directory') {
        await directory.render();
    }
});

export default socket;
