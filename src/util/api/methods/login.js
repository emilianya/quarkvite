import apiCall from "../apiCall.js";
import localForage from "localforage";

export default async function login(email, password) {
    let localConfig = await localForage.getItem("localConfig");
    console.log(localConfig)
    try {
        let res = await apiCall("auth/token", "POST", {
            email, password
        }, true)
        if (!res.request.success) return {success: false, error: res.response.message}
        localConfig.token = res.response.access_token;
        await localForage.setItem("localConfig", localConfig)
        return {success: true, res}
    } catch (e) {
        console.error(e);
        return {success: false, error: "Unexpected error logging in"}
    }
}