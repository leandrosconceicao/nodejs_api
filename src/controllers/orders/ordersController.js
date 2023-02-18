import Validators from "../../utils/utils.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";

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

  static async findAll(req, res) {
    try {
      let query = req.query;
      let sort = {};
      let or = {};
      if (Validators.checkField(req.headers.orderby) && Validators.checkField(req.headers.ordenation)) {
        sort[`${req.headers.orderby}`] = req.headers.ordenation;
      }
      if (Validators.checkField(query.isPreparation)) {
        or.products = {$elemMatch: {"setupIsFinished": false, "needsPreparation": true}};
      }
      if (Validators.checkField(query.from) && Validators.checkField(query.to)) {
        or.date = {$gte: new Date(query.from), $lte: new Date(query.to)}
      }
      if (Validators.checkField(query.id)) {
        or._id = query.id;
      }
      if (Validators.checkField(query.isTableOrders)) {
        if (query.isTableOrders) {
          or.tableId = { $ne: "" };
        }
      }
      if (Validators.checkField(query.clientId)) {
        or["client._id"] = query.clientId;
      }
      if (Validators.checkField(query.idTable)) {
        or.tableId = query.idTable;
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
        or.saller = query.saller;
      }
      if (Validators.checkField(query.accepted)) {
        or.accepted = query.accepted;
      }
      if (Validators.checkField(query.storeCode)) {
        or.storeCode = query.storeCode;
      }
      let orders = await Orders.find(or).sort(sort);
      if (!orders) {
        return res.status(400).json(ApiResponse.dbError());
      } else {
        return res.status(200).json(ApiResponse.returnSucess(orders));
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.dbError(e));
    }
  };

  static async post(req, res) {
    try { 
      let body = req.body;
      if (!Validators.checkField(body.storeCode)) {
        res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"));
      } else {
        let order = new Orders(body);
        order._id = TokenGenerator.generateId();
        order.date = Date.now();
        order.payment.data = Date.now();
        let or = await order.save();
        if (!or) {
          res.status(400).json(ApiResponse.returnError('Ocorreu um problema para salvar o pedido'));
        } else {
          const newOrder = await Orders.findById(or.id);
          if (!newOrder) {
            res.status(400).json(ApiResponse.returnError('Houve um problema com a requisição'));
          } else {
            res.status(201).json(ApiResponse.returnSucess(newOrder));
          }
        }
      }
    } catch (e) {
      res.status(500).json(ApiResponse.dbError(e));
    }
  };

  static async pushNewItems(req, res) {
    try {
      let body = req.body;
      if (!Validators.checkField(body.id)) {
        res.status(406).json(ApiResponse.parameterNotFound("(id)"));
      }
      if (!Validators.checkField(body.orders)) {
        res.status(406).json(ApiResponse.parameterNotFound("(orders)"));
      }
      const order = await Orders.findByIdAndUpdate(
        body.id, {$push: { products: body.orders }}
      );
      if (!order) {
        return res.status(400).json(ApiResponse.returnError({message: 'Nenhum dado atualizado'}));
      } else {
        return res.status(200).json(ApiResponse.returnSucess(order));
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.dbError(e));
    }
  };

  static async update(req, res) {
    try {
      let query = req.body.query
      let data = req.body.data;
      if (!Validators.checkField(query)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(query)'));
      } else if (!Validators.checkField(data)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(data)'));
      } else {
        const update = await Orders.updateOne(query, {$set: data})
        if (!update) {
          return res.status(400).json(ApiResponse.returnError('Nenhum dado atualizado, verifique os filtros'))
        } else {
          return res.status(200).json(ApiResponse.returnSucess());
        }
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.dbError(e));
    }
  }
}

export default OrdersController;
