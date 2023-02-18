import ApiResponse from "../../models/ApiResponse.js";
import TotalSales from "../../models/reports/Sales.js";
import Validators from "../../utils/utils.js";

class ReportsControllers {

    static async quantifySales(req, res) {
        try {
            let query = req.query;
            let or = {};
            if (!Validators.checkField(query.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            } else {
                or.storeCode = query.storeCode;
            }
            if (Validators.checkField(query.from) && Validators.checkField(query.to)) {
                or.date = {$gte: new Date(query.from), $lte: new Date(query.to)}
            }
            if (Validators.checkField(query.saller)) {
                or.saller = query.saller;
            }
            const sales = await TotalSales.aggregate([
                {
                    $match: or
                },
                {
                  '$project': {
                    'date': 1, 
                    'storeCode': 1, 
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
                              }, 
                              'in': {
                                '$multiply': [
                                  '$$pre', '$$cal'
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              ]);
            if (!sales) {
                return res.status(400).json(ApiResponse.noDataFound());
            } else {
                let totalValue = 0;
                let data = {};
                for (let i = 0; i < sales.length; i++) {
                    totalValue += sales[i].total;
                }
                data.totalValue = totalValue;
                data.orders = sales;
                return res.status(200).json(ApiResponse.returnSucess(data));
            }
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

}

export default ReportsControllers;