import Products from "../models/Product.js";
import ApiResponse from "../models/ApiResponse.js";

class ProductController {
    static findAll = (req, res) => {
        let prod = new Products(req.query);
        Products.find(prod,(err, prod) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err));
            } else {
                console.log(prod);
                res.status(200).json(ApiResponse.returnSucess(prod));
            }
        })
    }

    static addProduct = (req, res) => {
        let product = new Products(req.body);
        product.save((err) => {
            if (err) {
                res.status(500).send(ApiResponse.returnError())
            } else {
                res.status(201).json(ApiResponse.returnSucess())
            }
        })
        
    }

    static update = (req, res) => {
        let id = req.body.id;
        let data = req.body.data;
        Products.findByIdAndUpdate(id, {$set: data}, (err) => {
            if (err) {
                res.status(500).send(ApiResponse.dbError(err));
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }

    static deleteProduct = (req, res) => {
        let id = req.body.id;
        Products.findByIdAndDelete(id, (err) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }
}

export default ProductController;