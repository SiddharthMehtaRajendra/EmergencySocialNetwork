import SearchMessage from '../../view/searchMessage.html';
import '../../style/searchMessage.less';
import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from '../constant/serverInfo';

function addArrowBackListener(node) {
    document.getElementsByClassName('navbar-back-arrow')[0].addEventListener('click', function () {
        document.body.removeChild(node);
    });
}

async function getSearchResult() {
    const content = document.getElementById('search-message').value;
    console.log(content);
    if (content && content.length > 0) {
        const res = await axios.post(`${SERVER_ADDRESS}${API_PREFIX}/searchPublicMessage`, {
            searchMessage: content
        });
        console.log(res);
        document.getElementById('message-input').value = '';
    }
}

function addSearchIconListener(node) {
    document.getElementsByClassName('message-search-icon')[0].addEventListener('click', function () {
        getSearchResult();
    });
}

export default function createSearchBox(bgColor = '#FFFFFF', color = '#999999', height = '100px') {
    const node = document.createElement('div');
    node.setAttribute('class', 'toast');
    node.innerHTML = SearchMessage;
    if (bgColor) {
        node.style.backgroundColor = bgColor;
    }
    if (color) {
        node.style.color = color;
    }
    if (height) {
        node.style.height = height;
    }
    document.body.appendChild(node);
    addArrowBackListener(node);
    addSearchIconListener(node);
}
