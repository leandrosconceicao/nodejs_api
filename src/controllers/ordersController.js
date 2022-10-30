import Validators from '../utils/utils.js';
import Orders from '../models/Orders.js';
import ApiResponse from "../models/ApiResponse.js";

class OrdersController {
    static findOne = (req, res) => {
        let id = req.params.id;
        if (Validators.checkField(id)) {
            Orders.findById(id, (err, order) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err));
                } else {
                    res.status(200).json(ApiResponse.returnSucess(order != null ? [order] : []));
                }
            }) 
        }
    }

    static findAll = (req, res) => {
        let query = req.query;
        let or = {};
        if (Validators.checkField(query.id)) {
            or._id = query.id;
        } else if (Validators.checkField(query.isTableOrders)) {
            if (query.isTableOrders) {
                or.idMesa = {"$ne": ""};
            }
        } else if (Validators.checkField(query.idTable)) {
            or.idMesa = query.idTable;
        } else if (Validators.checkField(query.excludeStatus) && Validators.checkField(query.status)) {
            or.accountStatus = {"$nin": [query.status, 'Fechada']}
        } else if (Validators.checkField(query.accountStatus)) {
            or.accountStatus = query.accountStatus;
        } else if (Validators.checkField(query.saller)) {
            or.operador = query.saller;
        } else if (Validators.checkField(query.storeCode)) {
            or.storeCode = query.storeCode;
        } else if (Validators.checkField(query.diaOperacao)) {
            or.diaOperacao = query.operationDay;
        }
        console.log(or);
        Orders.find(or, (err, order) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err));
            } else {
                res.status(200).json(ApiResponse.returnSucess(order));
            }
        })
    }


}

export default OrdersController;