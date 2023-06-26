import Category from "../../models/Categories.js";
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import RegexBuilder from "../../utils/regexBuilder.js";
import ProductController from "./productController.js";
import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

class CategoryController {
  static async findAll(req, res, next) {
    try {
      let {id, storeCode, nome} = req.query;
      let cat = {};
      if (Validators.checkField(id)) {
        cat._id = id;
      }
      if (Validators.checkField(storeCode)) {
        cat.storeCode = new ObjectId(storeCode);
      }
      if (Validators.checkField(nome)) {
        cat.nome = RegexBuilder.searchByName(nome);
      }
      req.query = Category.find(cat);
      next();
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    try {
      let category = new Category(req.body);
      let lastCategory = await CategoryController.getLastCategory(category.storeCode);
      if (lastCategory) {
        category.ordenacao = lastCategory.ordenacao + 1;
      } else {
        category.ordenacao = 1;
      }
      await category.save();
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async getLastCategory(storeCode) {
    try {
      const categories = await Category.find({storeCode: storeCode});
      return categories.splice(-1)[0];
    } catch (e) {
      return null;
    }
  }

  static async updateName(req, res, next) {
    try {
      let {id, name} = req.body;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound("id").sendResponse(res);
      }
      if (!Validators.checkField(name)) {
        return ApiResponse.parameterNotFound("name").sendResponse(res);
      }
      await Category.findByIdAndUpdate(id, {"nome": name})
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async changeOrder(req, res, next) {
    try {
      const from = req.body.from;
      const to = req.body.to;
      if (!Validators.checkField(from._id) && !Validators.checkField(from.ordenacao)) {
        return ApiResponse.parameterNotFound('from').sendResponse(res);
      }
      if (!Validators.checkField(to._id) && !Validators.checkField(to.ordenacao)) {
        return ApiResponse.parameterNotFound('to').sendResponse(res);
      }
      await Category.findByIdAndUpdate(from._id, {"ordenacao": to.ordenacao});
      await Category.findByIdAndUpdate(to._id, {"ordenacao": from.ordenacao});
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      let id = req.body.id;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound('id').sendResponse(res);
      }
      if (await ProductController.productsHasCategory(id)) {
        return ApiResponse.badRequest('Categoria não pode ser excluida se possuir produtos cadastrados').sendResponse(res);
      }
      await Category.findByIdAndDelete(id);
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

export default CategoryController;
