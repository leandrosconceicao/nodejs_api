import Jwt from "jsonwebtoken";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";

const validateToken = (req, res, next) => {
    try {
        TokenGenerator.verify(req.headers.authorization);
        next();
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          res.status(401).json(ApiResponse.tokenExpired())
        } else if (e instanceof Jwt.JsonWebTokenError) {
          res.status(401).json(ApiResponse.unauthorized());
        } else {
          console.log(e);
          res.status(400).json(ApiResponse.returnError());
        }
      }
}

export default validateToken