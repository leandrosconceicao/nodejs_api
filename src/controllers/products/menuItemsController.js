import mongoose from "mongoose";
import ApiResponse from "../../models/ApiResponse.js";
import MenuItems from "../../models/MenuItems.js";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";
var ObjectId = mongoose.Types.ObjectId;

class menuItemsController {
  static async get(req, res, next) {
    try {
      let storeCode = req.query.storeCode;
      if (!Validators.checkField(storeCode)) {
        throw new InvalidParameter('storeCode');
      } else {
        const data = await MenuItems.aggregate([
            {
              $match: {
                  storeCode: new ObjectId(storeCode)
              }
            },
            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products",
              },
            },
            {
              $project: {
                _id: 0,
                storeCode: 0,
                "products.preparacao": 0,
                "products.categoria": 0,
                "products.storeCode": 0,
                "products.status": 0,
                "products.dataInsercao": 0,
                "products.categoryId": 0,
                "products.category": 0,
                "products.createDate": 0,
                "products.isActive": 0,
              },
            },
            {
              $sort: {
                ordenacao: 1,
              },
            },
          ]);
          res.status(200).json(ApiResponse.returnSucess(data));
      }
    } catch (e) {
      next(e);
    }
  }
}

export default menuItemsController;
