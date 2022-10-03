import establishments from "../models/Establishments.js";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";
import jwt from "jsonwebtoken";

class EstablishmentsController {
  static findAll = (req, res) => {
    let query = new establishments(req.query);
    establishments.find(query, (err, est) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(est));
      }
    });
  };

  static findOne = (req, res) => {
    const param = req.params;
    establishments.findById({ _id: param.id }, (err, establishments) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(establishments));
      }
    });
  };

  static add = (req, res) => {
    let token = req.headers.authorization;
    try {
      if (token == undefined || token != TokenGenerator.verify(token)) {
        res
          .status(403)
          .json(ApiResponse.returnError("Token inválido ou não informado"));
      } else if (req.body._id && req.body.stores) {
        let est = new establishments(req.body);
        est.save((err, ests) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            res.status(201).json(ApiResponse.returnSucess(ests));
          }
        });
      } else {
        res.status(400).json(ApiResponse.parameterNotFound(`id ou stores`));
      }
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json(ApiResponse.unauthorized());
      } else {
        return res.status(400).json(ApiResponse.unauthorized());
      }
    }
  };
}

export default EstablishmentsController;
