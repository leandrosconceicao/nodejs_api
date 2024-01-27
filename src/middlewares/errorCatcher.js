import mongoose from 'mongoose';
import NotFoundError from '../controllers/errors/NotFoundError.js';
import ApiResponse from '../models/ApiResponse.js';
import Jwt from "jsonwebtoken";
import ValidationError from '../controllers/errors/ValidationError.js';
import DuplicateError from '../controllers/errors/DuplicateError.js';
import InvalidParameter from '../controllers/errors/InvalidParameter.js';
import LogsController from '../controllers/logs/logsControllers.js';
import { AxiosError } from 'axios';
import MercadoPagoError from '../controllers/errors/MercadopagoError.js';

const logsControl = new LogsController();

// eslint-disable-next-line no-unused-vars
function errorCatcher(err, req, res, next) {
    console.error(err);
    if (err instanceof mongoose.Error.CastError) {
        return ApiResponse.badRequest(err.message).sendResponse(res)
    } 
    if (err instanceof mongoose.Error.ValidationError) {
        return new ValidationError(err).sendResponse(res);
    }
    if (err instanceof Jwt.JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
            return ApiResponse.tokenExpired().sendResponse(res);
        }
        if (err instanceof Jwt.JsonWebTokenError) {
            return ApiResponse.unauthorized().sendResponse(res);
        }
    } 
    if (err instanceof NotFoundError) {
        return err.sendResponse(res);
    }
    if (err instanceof InvalidParameter) {
        return err.sendResponse(res);
    }
    if (err.code == 11000) {
        return new DuplicateError(err).sendResponse(res);
    }
    if (err instanceof MercadoPagoError) {
        return err.sendResponse(res);
    }
    if (err instanceof AxiosError) {
        logsControl.saveReqLog(req, err.response.data);
        if (err.response.status < 499) {
            return ApiResponse.badRequest(err.response.data.mensagem).sendResponse(res);
        }
        return ApiResponse.serverError(err.response.data.mensagem).sendResponse(res);
    }
    return ApiResponse.serverError(err).sendResponse(res);  
}

export default errorCatcher;