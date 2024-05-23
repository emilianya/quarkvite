import apiCall from "../apiCall.js";

export default class UserInformation {
    admin = false;
    isBot = false;
    email;
    username;
    _id;
    avatar;
    iss;
    exp;

    constructor() {
    }

    async fetch() {
        let res = await apiCall("user/me", "GET");
        if (!res.fetchSuccess || !res.request.success) throw new Error("Failed to fetch user information");
        let userInfo = res.response.user;
        this.admin = userInfo.admin;
        this.isBot = userInfo.isBot;
        this.email = userInfo.email;
        this.username = userInfo.username;
        this._id = userInfo._id;
        this.avatar = userInfo.avatar;
        this.iss = userInfo.iss;
        this.exp = userInfo.exp;
    }
}