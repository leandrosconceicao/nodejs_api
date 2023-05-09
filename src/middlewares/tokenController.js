import Jwt from "jsonwebtoken";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";

const validateToken = (req, res, next) => {
    try {
        TokenGenerator.verify(req.headers.authorization);
        next();
      } catch (e) {
        next(e);
      }
}

export default validateToken