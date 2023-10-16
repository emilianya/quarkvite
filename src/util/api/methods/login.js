import APIConfig from "../APIConfig.js";
import apiCall from "../apiCall.js";
import localForage from "localforage";

export default async function login(email, password) {
    let apiConfig = new APIConfig();
    console.log(apiConfig)
    try {
        let res = await apiCall("auth/token", "POST", {
            email, password
        }, true)
        if (!res.request.success) return {success: false, error: res.response.message}
        apiConfig.token = res.response.access_token;
        let localConfig = await localForage.getItem("localConfig")
        localConfig.token = apiConfig.token;
        await localForage.setItem("localConfig", localConfig)
        return {success: true, res}
    } catch (e) {
        console.error(e);
        return {success: false, error: "Unexpected error logging in"}
    }
}