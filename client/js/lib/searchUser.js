import SearchUser from "../../view/searchUser.html";
import "../style/searchUser.less";
import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "../constant/serverInfo";

const maxUserNum = 9999;

function addArrawBackListener() {
    document.getElementsByClassName("navbar-back-arrow")[0].addEventListener("click", () => {
        window.history.go(-1);
    });
}
