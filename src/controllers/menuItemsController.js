import ApiResponse from "../models/ApiResponse.js";
import MenuItems from "../models/MenuItems.js";
import Validators from "../utils/utils.js";

class menuItemsController {
    static async get(req, res) {
        try {
            let storeCode = req.query.storeCode;
            if (Validators.checkField(storeCode)) {
                const data = await MenuItems.aggregate([
                    {
                        $match: {
                            storeCode: storeCode
                        }
                    }, {
                        $lookup: {
                            from: "produtos",
                            localField: "_id",
                            foreignField: "categoryId",
                            as: "products"
                        }
                    }, {
                        $project: {
                            _id: 0,
                            image: 0,
                            storeCode: 0,
                            "products._id": 0,
                            "products.preparacao": 0,
                            "products.categoria": 0,
                            "products.storeCode": 0,
                            "products.status": 0,
                            "products.dataInsercao": 0,
                            "products.categoryId": 0
                        }
                    }, {
                        $match: {
                            "products.isActive": true
                        }
                    }, {
                        $sort: {
                            ordenacao: 1
                        }
                    }, {
                        $project: {
                            "products.isActive": 0
                        }
                    }
                ]);
                res.status(200).json(ApiResponse.returnSucess(data));
            } else {
                res.status(400).json(ApiResponse.parameterNotFound('StoreCode'));
            }
        } catch (e) {
            res.status(500).json(ApiResponse.dbError(e));
        }
    }
}

export default menuItemsController;