import APIResponse from "./classes/APIResponse.js";
import localForage from "localforage";

/**
 *
 * @param apiMethod
 * @param httpMethod
 * @param body
 * @param skipAuth
 * @return {Promise<APIResponse>}
 */
export default async function apiCall (apiMethod, httpMethod, body = undefined, skipAuth = false) {
    let localConfig = await localForage.getItem("localConfig")
    if (!skipAuth && !localConfig.token) throw new Error("Missing token")
    try {
        let headers = {};
        let requestBody = undefined;
        if (httpMethod !== "GET") {
            headers.Accept = "application/json";
            headers["Content-Type"] = "application/json";
            requestBody = JSON.stringify(body);
        }
        if (!skipAuth) headers.Authorization = `Bearer ${localConfig.token}`;
        let apiRequest = await fetch(`${localConfig.network.baseUrl}/${localConfig.network.version}/${apiMethod}${httpMethod === "GET" && body ? "?" + new URLSearchParams(body) : ""}`, {
            method: httpMethod,
            headers,
            body: requestBody
        })
        let apiResponse = await apiRequest.json();
        return new APIResponse(apiResponse, apiRequest.status, true)
    } catch (e) {
        console.error("[apiCall]", e);
        throw e
    }
}