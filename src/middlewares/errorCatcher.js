import ApiResponse from '../models/ApiResponse.js';
import Jwt from "jsonwebtoken";

// eslint-disable-next-line no-unused-vars
function errorCatcher(err, req, res, next) {
    console.error(err);
    if (err instanceof Jwt.JsonWebTokenError) {
        ApiResponse.unauthorized().sendResponse(res, 401);
    } else {
        res.status(400).json(ApiResponse.returnError());    
    }
    ApiResponse.dbError(err).sendResponse(res, 500);
}

export default errorCatcher;