class Headers {
    constructor(headers) {
        this.headers = headers;
    }

    getOrderBy() {
        return {
            orderBy: this.headers.orderby,
            ordenation: this.headers.ordenation,
        }
    }

    getPagination() {
        let limit = parseInt(this.headers.limit);
        let page = parseInt(this.headers.page);
        let config = (page - 1) * limit ;
        return {
            pagination: config > 0 ? config : 0,
            limit: limit > 0 ? limit : Infinity
        }
    }
}


export default Headers;