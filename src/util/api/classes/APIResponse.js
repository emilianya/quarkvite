export default class APIResponse {
    request;
    response;
    statusCode;
    fetchSuccess;
    raw;
    constructor(res, statusCode, success) {
        this.statusCode = statusCode;
        this.fetchSuccess = success
        this.request = res.request;
        this.response = res.response;
        this.raw = res;
    }
}