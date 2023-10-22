import apiCall from "../apiCall.js";
import localForage from "localforage";

export default async function getNetworkInformation(network) {
    let localConfig = await localForage.getItem("localConfig")
    localConfig.network.baseUrl = network;
    await localForage.setItem("localConfig", localConfig)
    try {
        let res = await apiCall("network", "GET", undefined, true);
        res = res.raw;
        if (res.request) return {success: false, error: "Unexpected response while retrieving network information"}
        localConfig.networkInformation = res;
        localConfig.network.baseUrl = res.baseUrl
        await localForage.setItem("localConfig", localConfig)
        return {success: true, res};
    } catch (e) {
        console.error(e);
        return {success: false, error: "Failed to fetch network information"}
    }
}