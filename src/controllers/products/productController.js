import Products from '../../models/Product.js';
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import RegexBuilder from "../../utils/regexBuilder.js";
import NotFoundError from '../errors/NotFoundError.js';
import mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId;

class ProductController {

  static findOne = async (req, res, next) => {
    try {
      let id = req.params.id;
      const prod = await Products.findById(id)
        .populate("category")
        .exec();
      if (!prod) {
        throw new NotFoundError("Produto não localizado");
      }
      return ApiResponse.returnSucess(prod).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async findAll(req, res, next) {
    try {
      let {id, produto, storeCode, isActive, categoryId} = req.query;
      let prod = {};
      if (Validators.checkField(id)) {
          prod._id = new ObjectId(id);
      } 
      if (Validators.checkField(produto)) {
          prod.produto = RegexBuilder.searchByName(produto);
      } 
      if (Validators.checkField(categoryId)) {
        prod.category = new ObjectId(categoryId);
      }
      if (Validators.checkField(isActive)) {
        prod.isActive = isActive;
      }
      if (Validators.checkField(storeCode)) {
          prod.storeCode = storeCode;
      }
      req.query = Products.find(prod).populate("category")
      next();
    } catch (e) {
      next(e);
    }
  }

  static addProduct = async (req, res, next) => {
    try {
      let product = new Products(req.body);
      await product.save();
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  };

  static update = async (req, res, next) => {
    try {
        let id = req.body.id;
      let data = req.body.data;
      await Products.findByIdAndUpdate(id, { $set: data });
      ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  };

  static deleteProduct = async (req, res, next) => {
    try {
      let query = req.body;
      if (!query.id) {
        ApiResponse.parameterNotFound("id").sendResponse(res);
      }
      await Products.findByIdAndDelete(query.id);
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  };

  static async deleteImage(req, res, next) {
    try {
      let image = req.query.name;
      if (!image) {
        return ApiResponse.parameterNotFound("name").sendResponse(res);
      } else {
        await Products.updateMany(
          {
            image: {
              name: image,
            },
          },
          { $unset: { image: "" } }
        );
        return ApiResponse.returnSucess().sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }

  static async productsHasCategory(id) {
    try {
      const data = await Products.find({"category": id});
      if (data.length) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

export default ProductController;
