import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';

axios.defaults.withCredentials = true;

function initDirectoryPage() {
    renderDirectoryPage();
}

function renderDirectoryPage() {
    axios({
        url: `${SERVER_ADDRESS}${API_PREFIX}/users`,
        withCredentials: true
    }).then((res) => {
        const users = (res && res.data && res.data.users) || [];
        const directory = document.getElementById('user-directory');

        users.forEach((user, index) => {
            const userCard = document.createElement('div');
            const userName = document.createElement('div');
            const userAvatar = document.createElement('div');
            const userStatus = document.createElement('div');
            const bottomThinLine = document.createElement('div');

            userCard.className = 'single-user common-list-item';
            userName.className = 'username';
            userAvatar.className = 'avatar';
            userStatus.className = 'status-circle';
            bottomThinLine.className = 'right-thin-line';
            userName.innerText = user.username;
            userAvatar.innerText = user.username.charAt(0);
            userAvatar.setAttribute('style', `background-color: ${user.avatar || '#b4f5ff'};`);
            userCard.appendChild(userAvatar);
            userCard.appendChild(userStatus);
            userCard.appendChild(userName);
            if (index !== users.length - 1) {
                directory.appendChild(userCard);
                directory.appendChild(bottomThinLine);
            } else {
                directory.appendChild(userCard);
            }
        });
    }).catch((err) => {
        console.log(err.toString());
    });
}

export default initDirectoryPage;
