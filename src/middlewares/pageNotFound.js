import NotFoundError from "../controllers/errors/NotFoundError.js";
import ApiResponse from "../models/ApiResponse.js";

function pageNotFound(req, res, next) {
    const error = new NotFoundError();
    next(error);
}

export default pageNotFound;