import bottomPopCard from './bottomPopCard.html';
import './bottomPopCard.less';

function insertHtml() {
    const app = document.getElementById('app');
    const bottomPopCardNode = document.createElement('div');
    bottomPopCardNode.id = 'bottom-pop-card-node';
    bottomPopCardNode.style.visibility = 'hidden';
    bottomPopCardNode.innerHTML = bottomPopCard;
    app.appendChild(bottomPopCardNode);
}

function showBottomPopCard() {
    document.getElementById('bottom-pop-card-node').style.visibility = 'visible';
}

function closePopCard() {
    document.getElementById('bottom-pop-card-node').style.visibility = 'hidden';
}

function setupCloseBtn(callBack) {
    const closeBtn = document.getElementById('bottom-card-close-btn');
    if (callBack) {
        closeBtn.addEventListener('click', callBack);
    } else {
        closeBtn.addEventListener('click', closePopCard);
    }
}

function setupYesBtn(callBack) {
    const closeBtn = document.getElementById('bottom-card-close-btn');
    closeBtn.addEventListener('click', callBack);
}

function setupTitle(title) {
    const cardTitle = document.getElementById('bottom-pop-card-title');
    cardTitle.innerText = title;
}

function setupContent(content) {
    document.getElementById('bottom-pop-card-content').innerHTML = '';
    document.getElementById('bottom-pop-card-content').appendChild(content);
}

function bottomPopCardSetup(title, yesCallback, noCallback, contentHtml) {
    insertHtml();
    setupCloseBtn();
    if (title) {
        setupTitle(title);
    }
    if (yesCallback) {
        document.getElementById('bottom-pop-card-yes').addEventListener('click', yesCallback);
    }
    if (noCallback) {
        document.getElementById('bottom-pop-card-no').addEventListener('click', noCallback);
    } else {
        document.getElementById('bottom-pop-card-no').addEventListener('click', closePopCard);
    }
    if (contentHtml) {
        document.getElementById('bottom-pop-card-content').innerHTML = contentHtml;
    }
}

export { bottomPopCardSetup, showBottomPopCard, setupTitle, setupContent, setupYesBtn };
