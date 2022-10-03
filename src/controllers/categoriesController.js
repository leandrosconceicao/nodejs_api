import Category from "../models/Categories.js";
import ApiResponse from "../models/ApiResponse.js";
import TokenGenerator from "../utils/tokenGenerator.js";
import Jwt from "jsonwebtoken";

class CategoryController {
  static findAll = (req, res) => {
    let search = req.query;
    let cat = {};
    if (search.id.length > 0) {
      cat._id = search.id;
    } else if (search.storeCode.length > 0) {
      cat.storeCode = search.storeCode;
    } else if (search.nome.length > 0) {
      cat.nome = search.nome;
    }
    Category.find(cat, (err, result) => {
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
      let category = new Category(req.body);
      category.save((err) => {
        if (err) {
          console.log(1);
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          console.log(2);
          res.status(201).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(403).json(ApiResponse.unauthorized());
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
      Category.findByIdAndUpdate(id, { $set: data }, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(403).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static delete = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let id = req.body.id;
      Category.findByIdAndDelete(id, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(403).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };
}

export default CategoryController;
