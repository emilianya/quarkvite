import apiCall from "../apiCall.js";

/**
 * Check if token in APIConfig is accepted by network
 * @return {Promise<boolean>}
 */
export default async function verifyValidToken() {
    try {
        let res = await apiCall("user/me", "GET")
        return res.request.success
    } catch (e) {
        console.error(e);
        return false;
    }
}