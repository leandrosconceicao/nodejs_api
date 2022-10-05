import AddOnes from "../models/AddOnes.js";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";
import Jwt from "jsonwebtoken";
import Validators from "../utils/utils.js";

class AddOneController {
  static findAll = (req, res) => {
    let search = req.query;
    const add = new AddOnes();
    if (Validators.checkField(search.id)) {
      add._id = search.id;
    } else if (Validators.checkField(search.storeCode)) {
      add.storeCode = search.storeCode;
    } else if (Validators.checkField(search.name)) {
      add.nome = search.name;
    }
    console.log(add);
    AddOnes.find(add, (err, result) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(result));
      }
    });
  };

  static add = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let addOne = new AddOnes(req.body);
      addOne.save((err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(201).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static update = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let id = req.body.id;
      let data = req.body.data;
      AddOnes.findByIdAndUpdate(id, { $set: data }, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static delete = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let id = req.query.id;
      AddOnes.findByIdAndDelete(id, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };
}

export default AddOneController;
