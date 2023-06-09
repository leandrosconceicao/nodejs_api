import Validators from "../../utils/utils.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";
import Counter from "../base/Counters.js";
import NotFoundError from "../errors/NotFoundError.js";

class OrdersController {
  static async findOne(req, res, next) {
    try {
      let id = req.params.pedidosId;
      const query = await Orders.findById(id).populate("client");
      if (!query) {
        next(new NotFoundError('Pedido não encontrado'));
      } else {
        ApiResponse.returnSucess([query]).sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }

  static async findAll(req, res, next) {
    try {
      const {
        isPreparation, 
        type, 
        from, 
        to, 
        id, 
        isTableOrders, 
        clientId,
        idTable,
        status,
        accountStatus,
        saller,
        accepted,
        storeCode
      } = req.query;
      let or = {}
      if (Validators.checkField(isPreparation)) {
        or.products = {$elemMatch: {"setupIsFinished": false, "needsPreparation": true}}
      }
      if (Validators.checkField(type)) {
        or.orderType = type;
      }
      if (Validators.checkField(from) && Validators.checkField(to)) {
        or.date = {$gte: new Date(from), $lte: new Date(to)}
      }
      if (Validators.checkField(id)) {
        or._id = id;
      }
      if (Validators.checkField(isTableOrders)) {
        if (isTableOrders) {
          or.tableId = { $ne: "" }
        }
      }
      if (Validators.checkField(clientId)) {
        or.client._id = clientId;
      }
      if (Validators.checkField(idTable)) {
        or.tableId = idTable;
      }
      if (Validators.checkField(accountStatus)) {
        or.accountStatus = accountStatus;
      }
      if (Validators.checkField(saller)) {
        or.saller = saller;
      }
      if (Validators.checkField(accepted)) {
        or.accepted = accepted;
      }
      if (Validators.checkField(storeCode)) {
        or.storeCode = storeCode;
      }
      if (Validators.checkField(status)) {
        or.status = status;
      }
      req.query = Orders.find(or).populate("client");
      next();
    } catch (e) {
      return next(e);
    }
  }

  static async post(req, res, next) {
    try { 
      let body = req.body;
      if (!Validators.checkField(body.storeCode)) {
        res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"));
      } else {
        let order = new Orders(body);
        order.date = Date.now();
        order.payment.data = Date.now();
        let or = await order.save();
        await OrdersController.updateId(or);
        const newOrder = await Orders.findById(or.id).populate("client");
        ApiResponse.returnSucess(newOrder).sendResponse(res);
      }
    } catch (e) {
      next(e)
    }
  }

  static async updateId(order) {
    let count = 0;
    let counter = await Counter.find({});
    if (!counter.length) {
      count += 1;
    } else {
      count = counter[0].seq_value;
    }
    await Orders.findByIdAndUpdate(order.id, {"pedidosId": count + 1});
    await Counter.updateMany({}, {"seq_value": count})
  }

  static async pushNewItems(req, res, next) {
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
        ApiResponse.returnError({message: 'Nenhum dado atualizado'}).sendResponse(res);
      } else {
        ApiResponse.returnSucess(order).sendResponse(res);
      }
    } catch (e) {
      return next(e)
    }
  }

  static async update(req, res, next) {
    try {
      let query = req.body.query
      let data = req.body.data;
      if (!Validators.checkField(query)) {
        ApiResponse.parameterNotFound('(query)').sendResponse(res);
      } else if (!Validators.checkField(data)) {
        ApiResponse.parameterNotFound('(data)').sendResponse(res);
      } else {
        const update = await Orders.updateMany(query, {$set: data})
        if (!update) {
          ApiResponse.returnError('Nenhum dado atualizado, verifique os filtros').sendResponse(res);
        } else {
          ApiResponse.returnSucess().sendResponse(res);
        }
      }
    } catch (e) {
      return next(e)
    }
  }
}

export default OrdersController;
