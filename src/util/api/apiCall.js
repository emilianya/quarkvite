import APIConfig from "./APIConfig.js";
import APIResponse from "./classes/APIResponse.js";

/**
 *
 * @param apiMethod
 * @param httpMethod
 * @param body
 * @param skipAuth
 * @return {Promise<APIResponse>}
 */
export default async function apiCall (apiMethod, httpMethod, body = undefined, skipAuth = false) {
    let apiConfig = new APIConfig();
    if (!skipAuth && !apiConfig.token) throw new Error("Missing token")
    try {
        let headers = {};
        let requestBody = undefined;
        if (httpMethod !== "GET") {
            headers.Accept = "application/json";
            headers["Content-Type"] = "application/json";
            requestBody = JSON.stringify(body);
        }
        if (!skipAuth) headers.Authorization = `Bearer ${apiConfig.token}`;
        let apiRequest = await fetch(`${apiConfig.baseUrl}/${apiConfig.version}/${apiMethod}${httpMethod === "GET" && body ? "?" + new URLSearchParams(body) : ""}`, {
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