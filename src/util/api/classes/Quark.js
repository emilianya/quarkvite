import apiCall from "../apiCall.js";
import Channel from "./Channel.js";

export default class Quark {
    channels = [];
    _id;
    members = [];
    name;
    iconUri;
    invite;
    owners = [];
    roles = [];

    constructor(quark) {
        this.updateFrom(quark);
    }

    async fetch() {
        let res = await apiCall(`quark/${this._id}`, "GET")
        if (!res.fetchSuccess || !res.request.success) throw new Error(`Failed to fetch quark ${this._id} information`);
        let quark = res.response.quark;
        this.updateFrom(quark);
    }

    updateFrom(quark) {
        this.channels = quark.channels.map(channel => new Channel(channel));
        this._id = quark._id;
        this.members = quark.members;
        this.name = quark.name;
        this.iconUri = quark.iconUri;
        this.invite = quark.invite;
        this.owners = quark.owners;
        this.roles = quark.roles;
    }

    subscribe(gatewaySend) {
        gatewaySend({
            event: "subscribe",
            message: `quark_${this._id}`
        });
        console.log(`Subscribed to quark_${this._id}`)
        this.channels.forEach(channel => channel.subscribe(gatewaySend));
    }
}