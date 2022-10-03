import users from "../models/Users.js";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";
import PassGenerator from "../utils/passGenerator.js";
import Jwt from "jsonwebtoken";

class UserController {
  static add = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let user = new users(req.body);
      user.pass = new PassGenerator(user.pass).build();
      user.save((err, users) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(201).json(ApiResponse.returnSucess(users));
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        console.log(e);
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static delete = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let id = req.body.id;
      users.findByIdAndDelete(id, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      }
    }
  };

  static update = (req, res) => {
    let id = req.body.id;
    let data = req.body.data;
    users.findByIdAndUpdate(id, { $set: data }, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static findAll = (req, res) => {
    users.find(req.query, (err, users) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(users));
      }
    });
  };

  static authenticate = (req, res) => {
    try {
      const hashPass = new PassGenerator(req.body.password).build();
      users.findOne({ _id: req.body.email, pass: hashPass }, (err, users) => {
        if (err) {
          res
            .status(500)
            .json(ApiResponse.returnError(`Ocorreu um problema ${err}`));
        } else {
          if (users) {
            const token = TokenGenerator.generate(req.body.email);
            res.set("Authorization", token);
            res.status(200).json(ApiResponse.returnSucess(users));
          } else {
            res
              .status(400)
              .json(ApiResponse.returnError("Dados incorretos ou inválidos."));
          }
        }
      });
    } catch (e) {
      res.status(500).json(ApiResponse.unknownError(e));
    }
  };
}

export default UserController;
