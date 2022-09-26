import products from "../models/Product.js";
import ApiResponse from "../models/api_response.js";

class ProductController {
    static findAll = (req, res) => {
        const prod = new products(req.query);
        products.find((err, prod) => {
            res.status(200).json(ApiResponse.returnSucess(products));
        })
    }

    static pushProduct = (req, res) => {
        let product = new products(req.body);
        product.save((err) => {
            if (err) {
                res.status(500).send(ApiResponse.returnError())
            } else {
                res.status(201).send(ApiResponse.returnSucess(product.toJSON()))
            }
        })
        
    }

    static updateProduct = (req, res) => {
        const id = req.body.id;
        const body = req.body.data;
        products.findByIdAndUpdate(id, {$set: body}, (err) => {
            if (!err) {
                res.status(200).json(ApiResponse.returnSucess())
            } else {
                res.status(500).send(ApiResponse.dbError(err));
            }
        })
    }

    static deleteProduct = (req, res) => {
        const id = req.body.id;
        products.findByIdAndDelete(id, (err) => {
            if (!err) {
                res.status(200).json(ApiResponse.returnSucess())
            } else {
                res.status(500).json(ApiResponse.dbError(err))
            }
        })
    }
}

export default ProductController;