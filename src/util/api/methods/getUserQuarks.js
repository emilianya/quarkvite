import apiCall from "../apiCall.js";
import Quark from "../classes/Quark.js";

/**
 * Get list of user quarks
 * @return {Promise<Quark[]>}
 */
export default async function getUserQuarks() {
    let res = await apiCall("quark/me", "GET");
    if (!res.fetchSuccess || !res.request.success) throw new Error("Failed to fetch user quarks");
    return res.response.quarks.map(quark => {
        return new Quark(quark)
    });
}