export default class APIConfig {
    static _instance;
    baseUrl;
    version = "v2";
    token;
    networkInformation;
    constructor() {
        if (APIConfig._instance) return APIConfig._instance;
        APIConfig._instance = this;
    }
}