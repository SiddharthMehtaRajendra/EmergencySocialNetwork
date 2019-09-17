import axios from 'axios';

function jumptoRegisterHandler() {
    let registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', () => {
        window.location.hash = "/register";
        })
    }

export default jumptoRegisterHandler
