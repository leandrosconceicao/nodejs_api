import products from "../models/Product.js";
import ApiResponse from "../models/api_response.js";

class ProductController {
    static findAll = (req, res) => {
        products.find((err, products) => {
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
}

export default ProductController;