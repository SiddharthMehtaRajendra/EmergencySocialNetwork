import axios from 'axios';
import { API_PREFIX, SERVER_ADDRESS } from './constant/serverInfo';
function initUserInfo() {
    axios({
        url: `${SERVER_ADDRESS}${API_PREFIX}/user/`,
        withCredentials: true
    }).then((res) => {
        if (res.status === 200 && res.data.success && res.data.user) {
            window.user = res.data.user;
        }
    });
}

export default initUserInfo;
