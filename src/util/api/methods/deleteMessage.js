import apiCall from "../apiCall.js";

/**
 * Deletes a message
 * @return {Promise<{success: boolean, reason: string}>}
 */
export default async function deleteMessage(channelId, messageId) {
    try {
        let res = await apiCall(`channel/${channelId}/messages/${messageId}`, "DELETE");
        if (!res.fetchSuccess) return {success: false, reason: "Unexpected error"};
        return {success: res.request.success, reason: res.response.message};
    } catch (e) {
        console.error(e);
        return {success: false, reason: "Unexpected error"}
    }
}