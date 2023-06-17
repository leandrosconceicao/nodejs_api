import ApiResponse from "../../models/ApiResponse.js";
import TotalSales from "../../models/reports/Sales.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";

class ReportsControllers {

    static async quantifySales(req, res, next) {
        try {
            let {storeCode, from, to, saller, type} = req.query;
            let or = {};
            if (!Validators.checkField(storeCode)) {
                return ApiResponse.parameterNotFound('storeCode').sendResponse(res);
            } else {
                or.storeCode = storeCode;
            }
            if (Validators.checkField(from) && Validators.checkField(to)) {
                or.createDate = {$gte: new Date(from), $lte: new Date(to)}
            }
            if (Validators.checkField(saller)) {
                or.userCreate = saller;
            }
            if (Validators.checkField(type)) {
              or.orderType = type;
            }
            const sales = await TotalSales.aggregate([
                {
                    '$match': or
                },
                {
                  '$project': {
                    'total': {
                      '$sum': {
                        '$map': {
                          'input': {
                            '$range': [
                              0, {
                                '$size': '$products'
                              }
                            ]
                          }, 
                          'as': 'ix', 
                          'in': {
                            '$let': {
                              'in': {
                                '$multiply': [
                                  '$$pre', '$$cal'
                                ]
                              }, 
                              'vars': {
                                'pre': {
                                  '$arrayElemAt': [
                                    '$products.quantity', '$$ix'
                                  ]
                                }, 
                                'cal': {
                                  '$arrayElemAt': [
                                    '$products.unitPrice', '$$ix'
                                  ]
                                }
                              }
                            }
                          }
                        }
                      }
                    }, 
                    'createDate': 1, 
                    'storeCode': 1,
                    'orderType': 1
                  }
                }
              ]);
            if (!sales) {
                throw new NotFoundError("Busca não localizou dados");
            } else {
                let totalValue = 0;
                let data = {};
                for (let i = 0; i < sales.length; i++) {
                    totalValue += sales[i].total;
                }
                data.totalValue = totalValue;
                data.orders = sales;
                return ApiResponse.returnSucess(data).sendResponse(res);
            }
        } catch (e) {
            next(e);
        }
    }

}

export default ReportsControllers;