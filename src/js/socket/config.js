import io from 'socket.io-client';
import chat from '../chat';
import processMessage from '../lib/processMessage';
import directory from '../directory';

const socket = io('http://localhost:8000');

socket.on('UPDATE_MESSAGE', function (msg) {
    if (msg) {
        chat.renderOneMessage(processMessage(msg));
    }
});

socket.on('AUTH_FAILED', function () {
    window.location.hash = '/join';
});

socket.on('UPDATE_DIRECTORY', async function (data) {
    console.log(data);
    await directory.fetchData();
    console.log(window.location.hash);
    if (window.location.hash === '#/directory') {
        console.log('need render');
        await directory.render();
    }
});

export default socket;
