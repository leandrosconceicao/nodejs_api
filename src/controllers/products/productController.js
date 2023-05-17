import Products from '../../models/Product.js';
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import NotFoundError from '../errors/NotFoundError.js';
import Headers from '../base/Headers.js';

class ProductController {

  static findOne = async (req, res, next) => {
    try {
      let id = req.params.id;
      const prod = await Products.findById(id)
      if (!prod) {
        throw new NotFoundError("Produto não localizado");
      }
      return ApiResponse.returnSucess(prod).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static findAll = async (req, res, next) => {
    try {
      // const config = new Headers(req.headers).getPagination();
      let {id, nome, storeCode} = req.query;
      let prod = {};
      if (Validators.checkField(id)) {
          prod._id = id;
      } else if (Validators.checkField(nome)) {
          prod.produto = new RegExp(nome, "i");
      } else if (Validators.checkField(storeCode)) {
          prod.storeCode = storeCode;
      }
      req.query = Products.find(prod);
      next();
    } catch (e) {
      next(e);
    }
  };

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
}

export default ProductController;
