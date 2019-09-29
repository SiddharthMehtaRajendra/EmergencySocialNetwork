import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from './constant';

function initRegisterHandler() {
    let registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', () => {
        axios.get(`${SERVER_ADDRESS}${API_PREFIX}/test`).then((res) => {
            console.log(res);
            document.getElementById('api-result').innerText = JSON.stringify(res.data);
            // jump to another web
        });
    });
}

export default initRegisterHandler;
