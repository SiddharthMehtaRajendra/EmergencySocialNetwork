// import axios from 'axios';

function jumptoRegisterHandler() {
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', () => {
        window.location.hash = '/register';
    });
}

export default jumptoRegisterHandler;
