import Validators from "../../utils/utils.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";

class OrdersController {
  static findOne = (req, res) => {
    let id = req.params.id;
    if (Validators.checkField(id)) {
      Orders.findById(id, (err, order) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res
            .status(200)
            .json(ApiResponse.returnSucess(order != null ? [order] : []));
        }
      });
    }
  };

  static findAll = (req, res) => {
    let query = req.query;
    console.log(query);
    let or = {};
    if (Validators.checkField(query.id)) {
      or._id = query.id;
    }
    if (Validators.checkField(query.isTableOrders)) {
      if (query.isTableOrders) {
        or.idMesa = { $ne: "" };
      }
    }
    if (Validators.checkField(query.clientId)) {
      or["client._id"] = query.clientId;
    }
    if (Validators.checkField(query.idTable)) {
      or.idMesa = query.idTable;
    }
    if (
      Validators.checkField(query.excludeStatus) &&
      Validators.checkField(query.status)
    ) {
      or.accountStatus = { $nin: [query.status, "Fechada"] };
    }
    if (Validators.checkField(query.accountStatus)) {
      or.accountStatus = query.accountStatus;
    }
    if (Validators.checkField(query.saller)) {
      or.operador = query.saller;
    }
    if (Validators.checkField(query.storeCode)) {
      or.storeCode = query.storeCode;
    }
    if (Validators.checkField(query.diaOperacao)) {
      or.diaOperacao = query.operationDay;
    }
    console.log(or);
    Orders.find(or, (err, order) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(order));
      }
    });
  };

  static post = (req, res) => {
    let body = req.body;
    if (Validators.checkField(body.storeCode)) {
      let order = new Orders(body);
      order.save((err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(201).json(ApiResponse.returnSucess());
        }
      });
    } else {
      res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"));
    }
  };

  static put = (req, res) => {
    let body = req.body;
    if (!Validators.checkField(body.id)) {
      res.status(406).json(ApiResponse.parameterNotFound("(id)"));
    }
    if (!Validators.checkField(body.orders)) {
      res.status(406).json(ApiResponse.parameterNotFound("(orders)"));
    }
    Orders.findByIdAndUpdate(
      body.id,
      {
        $push: { pedidos: body.orders },
      },
      (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      }
    );
  };
}

export default OrdersController;
