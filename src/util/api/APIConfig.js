export default class APIConfig {
    static _instance;
    baseUrl;
    version = "v2";
    token;
    networkInformation;
    constructor() {
        console.log("APIConfig constructor")
        if (APIConfig._instance) return APIConfig._instance;
        APIConfig._instance = this;
        console.log("APIConfig constructor (new instance)")
    }
}