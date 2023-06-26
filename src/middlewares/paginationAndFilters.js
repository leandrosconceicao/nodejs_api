import ApiResponse from "../models/ApiResponse.js";
import Headers from "../controllers/base/Headers.js";

async function paginationAndFilters(req, res, next) {
    try {
        const headers = new Headers(req.headers);
        const paginationConfig = headers.getPagination();
        const ordenationConfig = headers.getOrderBy();
        const request = req.query;
        const parsedData = await request.find()
            .sort({[ordenationConfig.orderBy]: ordenationConfig.ordenation})
            .skip(paginationConfig.pagination)
            .limit(paginationConfig.limit)
        ApiResponse.returnSucess(parsedData).sendResponse(res);
    } catch (e) {
        next(e);
    }
}

export default paginationAndFilters;