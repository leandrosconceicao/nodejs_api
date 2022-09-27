import products from "../models/Product.js";
import ApiResponse from "../models/api_response.js";

class ProductController {
    static findAll = (req, res) => {
        let prod = new products(req.query);
        products.find((err, prod) => {
            res.status(200).json(ApiResponse.returnSucess(products));
        })
    }

    static addProduct = (req, res) => {
        let product = new products(req.body);
        product.save((err) => {
            if (err) {
                res.status(500).send(ApiResponse.returnError())
            } else {
                res.status(201).send(ApiResponse.returnSucess(product.toJSON()))
            }
        })
        
    }

    static update = (req, res) => {
        let id = req.body.id;
        let data = req.body.data;
        products.findByIdAndUpdate(id, {$set: data}, (err) => {
            if (err) {
                res.status(500).send(ApiResponse.dbError(err));
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }

    static deleteProduct = (req, res) => {
        let id = req.body.id;
        products.findByIdAndDelete(id, (err) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }
}

export default ProductController;