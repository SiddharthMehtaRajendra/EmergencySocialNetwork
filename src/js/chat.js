// Go Back Example
// document.getElementById('js-go-back-test').addEventListener('click', function () {
//     window.history.back(-1);
// });
// import socket from './socket';
import axios from 'axios';
import { SERVER_ADDRESS } from './constant/serverInfo';

function initChat() {
    console.log(window.location.href);
    // socket.emit('MSG', {
    //     test: 'test'
    // });

    window.state = {};
    window.state.Hello = 123;
    console.log(window.state);
    axios({
        method: 'get',
        url: `${SERVER_ADDRESS}/heartbeat`
    });
}

export default initChat;
