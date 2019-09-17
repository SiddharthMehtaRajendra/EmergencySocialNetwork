import axios from 'axios';
import { validateUserName, validatePassword } from './validation'
import { SERVER_ADDRESS, API_PREFIX } from './constant'
import * as util from './appUtils'

function initRegisterHandler() {
    let registerBtn = document.getElementById('register-btn');
    let $username = document.getElementById('username')
    let $password = document.getElementById('password')
    registerBtn.addEventListener('click', (e) => {
        $username.insertAdjacentHTML('afterend', "")
        $password.insertAdjacentHTML('afterend', "")
        let userValidation = validateUserName($username.value)
        let passwordValidation = validatePassword($password.value)
        if (userValidation.result !== false && passwordValidation.result !== false) {
            axios.post(`${SERVER_ADDRESS}${API_PREFIX}/registerUser`, {
                username: $username.value,
                password: $password.value
            }).then((res) => {
                console.log(res);
                document.getElementById('api-result').innerText = JSON.stringify(res.data);
            }).catch((err) => {
                console.log(err)
            })
        } else {
            let html = document.createElement('div')
            html.className = "error-register"
            if(util.isNotEmpty(userValidation.text)){
                html.innerText = userValidation.text
                $username.insertAdjacentHTML('afterend', html)
            } 
            if(util.isNotEmpty(passwordValidation.text)) {
                html.innerText = passwordValidation.text
                $password.insertAdjacentHTML('afterend', html)
            }
        }
    })
}

export default initRegisterHandler
