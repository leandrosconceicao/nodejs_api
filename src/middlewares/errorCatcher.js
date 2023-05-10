import mongoose from 'mongoose';
import NotFoundError from '../controllers/errors/NotFoundError.js';
import ApiResponse from '../models/ApiResponse.js';
import Jwt from "jsonwebtoken";
import ValidationError from '../controllers/errors/ValidationError.js';

// eslint-disable-next-line no-unused-vars
function errorCatcher(err, req, res, next) {
    console.error(err);
    if (err instanceof mongoose.Error.CastError) {
        ApiResponse.badRequest().sendResponse(res)
    } else if (err instanceof mongoose.Error.ValidationError) {
        new ValidationError(err).sendResponse(res);
    } else if (err instanceof Jwt.JsonWebTokenError) {
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