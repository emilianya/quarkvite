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
        console.log(`Subscribed to channel_${this._id}`)
    }
}