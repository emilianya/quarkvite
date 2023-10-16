import APIConfig from "../APIConfig.js";
import apiCall from "../apiCall.js";
import localForage from "localforage";

export default async function networkInformation(network) {
    let apiConfig = new APIConfig();
    console.log(network)
    apiConfig.baseUrl = network;
    console.log(apiConfig)
    try {
        let res = await apiCall("network", "GET", undefined, true);
        res = res.raw;
        if (res.request) return {success: false, error: "Unexpected response while retrieving network information"}
        apiConfig.networkInformation = res;
        apiConfig.baseUrl = res.baseUrl
        let localConfig = await localForage.getItem("localConfig")
        localConfig.network.baseUrl = apiConfig.baseUrl;
        await localForage.setItem("localConfig", localConfig)
        return {success: true, res};
    } catch (e) {
        console.error(e);
        return {success: false, error: "Failed to fetch network information"}
    }
}