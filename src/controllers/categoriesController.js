import Category from "../models/Categories.js";
import ApiResponse from "../models/ApiResponse.js";
import Validators from "../utils/utils.js";

class CategoryController {
  static findAll = (req, res) => {
    let search = req.query;
    let cat = {};
    if (Validators.checkField(search.id)) {
      cat._id = search.id;
    } else if (Validators.checkField(search.storeCode)) {
      cat.storeCode = search.storeCode;
    } else if (Validators.checkField(search.nome)) {
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
  };

  static update = (req, res) => {
    let id = req.body.id;
    let data = req.body.data;
    Category.findByIdAndUpdate(id, { $set: data }, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static delete = (req, res) => {
    let id = req.query.id;
    Category.findByIdAndDelete(id, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };
}

export default CategoryController;
