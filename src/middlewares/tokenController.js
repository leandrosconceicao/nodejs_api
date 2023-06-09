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