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
        // TODO: User Exist and pass the validation, should go into system
        // console.log(res);
        const users = (res && res.data && res.data.users) || [];
        // console.log(users);
        const directory = document.getElementById('user-directory');

        users.forEach(user => {
            const userCard = document.createElement('div');
            const userName = document.createElement('div');
            const userAvatar = document.createElement('div');
            const userStatus = document.createElement('div');

            userCard.className = 'user-card border-card';
            userName.className = 'username';
            userAvatar.className = 'avatar';
            userStatus.className = 'status-circle';
            userName.innerText = user.username;
            userAvatar.innerText = user.username.charAt(0);
            userAvatar.setAttribute('style', 'background-color: user.avatar;');
            // userStatus = user.status;
            userCard.appendChild(userAvatar);
            userCard.appendChild(userStatus);
            userCard.appendChild(userName);
            directory.appendChild(userCard);
        });
    }).catch((err) => {
        console.log(err.toString());
    });
}

export default initDirectoryPage;
