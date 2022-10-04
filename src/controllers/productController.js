import Products from "../models/Product.js";
import ApiResponse from "../models/ApiResponse.js";
import Validators from "../utils/utils.js";

class ProductController {
  static findAll = (req, res) => {
    let query = req.query;
    let prod = {};
    if (Validators.checkField(query.id)) {
        prod._id = query.id;
    } else if (Validators.checkField(query.nome)) {
        prod.nome = query.nome;
    } else if (Validators.checkField(query.storeCode)) {
        prod.storeCode = query.storeCode;
    }
    Products.find(prod, (err, prod) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(prod));
      }
    });
  };

  static addProduct = (req, res) => {
    let product = new Products(req.body);
    product.save((err) => {
      if (err) {
        res.status(500).send(ApiResponse.returnError());
      } else {
        res.status(201).json(ApiResponse.returnSucess());
      }
    });
  };

  static update = (req, res) => {
    let id = req.body.id;
    let data = req.body.data;
    Products.findByIdAndUpdate(id, { $set: data }, (err) => {
      if (err) {
        res.status(500).send(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static deleteProduct = (req, res) => {
    let id = req.body.id;
    Products.findByIdAndDelete(id, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static async deleteImage(req, res) {
    try {
      let image = req.query.name;
      if (image) {
        let db = await Products.updateMany(
          {
            image: {
              name: image,
            },
          },
          { $unset: { image: "" } }
        );
        if (db.modifiedCount > 0) {
            res.status(200).json(ApiResponse.returnSucess())
        } else {
            res.status(400).json(ApiResponse.returnError('Nenhum dado atualizado, verifique os filtros.'))
        }
      } else {
        res.status(400).json(ApiResponse.parameterNotFound());
      }
    } catch (e) {
      res.status(500).json(ApiResponse.dbError());
    }
  }
}

export default ProductController;
