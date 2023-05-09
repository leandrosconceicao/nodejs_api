import NotFoundError from '../controllers/errors/NotFoundError.js';
import ApiResponse from '../models/ApiResponse.js';
import Jwt from "jsonwebtoken";

// eslint-disable-next-line no-unused-vars
function errorCatcher(err, req, res, next) {
    console.error(err);
    if (err instanceof Jwt.JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
            ApiResponse.tokenExpired().sendResponse(res);
        }
        if (err instanceof Jwt.JsonWebTokenError) {
            ApiResponse.unauthorized().sendResponse(res);
        }
    } else if (err instanceof NotFoundError) {
        err.sendResponse(res);
    } else {    
        ApiResponse.dbError(err).sendResponse(res);
    }
}

export default errorCatcher;