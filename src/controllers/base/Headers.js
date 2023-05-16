class Headers {
    constructor(headers, defaultLimit=50, defaultPage=1) {
        this.headers = headers;
        this.defaultLimit = defaultLimit,
        this.defaultPage = defaultPage
    }

    getPagination() {
        let limit = parseInt(this.headers.limit);
        let page = parseInt(this.headers.page);
        let config = (page - 1) * limit ;
        return {
            pagination: config > 0 ? config : this.defaultPage,
            limit: limit > 0 ? limit : this.defaultLimit
        }
    }
}


export default Headers;