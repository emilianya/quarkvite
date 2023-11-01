import apiCall from "../apiCall.js";

export default class Channel {
    _id;
    name;
    description;
    quark;
    constructor(channel) {
        this.updateFrom(channel);
    }

    async fetch() {
        let res = await apiCall(`channel/${this._id}`, "GET")
        if (!res.fetchSuccess || !res.request.success) throw new Error(`Failed to fetch channel ${this._id} information`);
        let channel = res.response.channel;
        this.updateFrom(channel);
    }

    updateFrom(channel) {
        this._id = channel._id;
        this.name = channel.name;
        this.description = channel.description;
        this.quark = channel.quark;
    }

    subscribe(gatewaySend) {
        gatewaySend({
            event: "subscribe",
            message: `channel_${this._id}`
        })
        // console.debug(`Subscribed to channel_${this._id}`)
    }

    async sendMessage(content) {
        let res = await apiCall(`channel/${this._id}/messages`, "POST", {
            content
        })
        if (!res.success || !res.fetchSuccess) {
            // TODO: implement a handler here
            console.error(res.response.message);
        }
    }

    async fetchMessages(setMessageCache) {
        let res = await apiCall(`channel/${this._id}/messages`, "GET")
        if (!res.success || !res.fetchSuccess) {
            // TODO: implement a handler here
            console.error(res.response.message);
        }
        setMessageCache(cache => {
            if (!cache) cache = {};
            if (!cache[this._id]) cache[this._id] = [];
            cache[this._id].push(...res.response.messages)

            return structuredClone(cache)
        })
    }

    event(eventData, clientState) {
        switch (eventData.eventId) {
            case "messageCreate":
                clientState.setMessageCache(cache => {
                    if (!cache[eventData.message.channelId]) cache[eventData.message.channelId] = []
                    cache[eventData.message.channelId].push({message: eventData.message, author: eventData.author})

                    return structuredClone(cache)
                })
                break;
            case "messageDelete":
                clientState.setMessageCache(cache => {
                    // TODO: This does not work :(
                    if (!cache[eventData.message.channelId]) cache[eventData.message.channelId] = []
                    cache[eventData.message.channelId].filter(m => m.message._id !== eventData.message._id);
                    return structuredClone(cache)
                })
                break;
            case "messageUpdate":
            case "channelCreate":
            case "channelDelete":
            case "channelUpdate":
                console.warn(`Unhandled event ${eventData.eventId}`, eventData)
        }
    }
}