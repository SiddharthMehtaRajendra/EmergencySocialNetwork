import bottomPopCard from "./view.html";
import "./style.less";

const mount = function () {
    const app = document.getElementById("app");
    const bottomPopCardNode = document.createElement("div");
    bottomPopCardNode.id = "bottom-pop-card-node";
    bottomPopCardNode.style.visibility = "hidden";
    bottomPopCardNode.innerHTML = bottomPopCard;
    app.appendChild(bottomPopCardNode);
};

const show = function () {
    document.getElementById("bottom-pop-card-node").style.visibility = "visible";
};

const close = function () {
    document.getElementById("bottom-pop-card-node").style.visibility = "hidden";
};

const setBlackCoverClose = function () {
    const blackCover = document.getElementById("black-cover");
    blackCover.addEventListener("click", close);
};

const setYesCallback = function (callBack) {
    const closeBtn = document.getElementById("bottom-card-close-btn");
    closeBtn.addEventListener("click", callBack);
};

const setTitle = function (title) {
    const cardTitle = document.getElementById("bottom-pop-card-title");
    cardTitle.innerText = title;
};

const setContent = function (content) {
    document.getElementById("bottom-pop-card-content").innerHTML = "";
    document.getElementById("bottom-pop-card-content").appendChild(content);
};

const init = function (title, yesCallback, noCallback, contentHtml) {
    mount();
    setBlackCoverClose();
    if(title) {
        setTitle(title);
    }
    if(yesCallback) {
        document.getElementById("bottom-pop-card-yes").addEventListener("click", yesCallback);
    }
    if(noCallback) {
        document.getElementById("bottom-pop-card-no").addEventListener("click", noCallback);
    } else {
        document.getElementById("bottom-pop-card-no").addEventListener("click", close);
    }
    if(contentHtml) {
        document.getElementById("bottom-pop-card-content").innerHTML = contentHtml;
    }
};

const BottomPopCard = {
    init,
    show,
    setTitle,
    setContent,
    setYesCallback
};

export default BottomPopCard;
