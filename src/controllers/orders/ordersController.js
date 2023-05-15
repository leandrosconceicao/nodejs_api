import Validators from "../../utils/utils.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import NotFoundError from "../errors/NotFoundError.js";

class OrdersController {
  static async findOne(req, res, next) {
    try {
      let id = req.params.id;
      const query = await Orders.findById(id);
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
      const {limit = 10, page = 1, orderby, ordenation} = req.headers;
      const query = req.query;
      // const {
      //   isPreparation, 
      //   type, 
      //   from, 
      //   to, 
      //   id, 
      //   isTableOrders, 
      //   clientId,
      //   idTable,
      //   excludeStatus,
      //   status,
      //   accountStatus,
      //   saller,
      //   accepted,
      //   storeCode
      // } = req.query;
      let sort = {}
      let or = {}
      if (Validators.checkField(orderby) && Validators.checkField(ordenation)) {
        sort[`${orderby}`] = ordenation;
      }
      if (Validators.checkField(query.isPreparation)) {
        or.products = {$elemMatch: {"setupIsFinished": false, "needsPreparation": true}}
      }
      if (Validators.checkField(query.type)) {
        or.orderType = query.type;
      }
      if (Validators.checkField(query.from) && Validators.checkField(query.to)) {
        or.date = {$gte: new Date(query.from), $lte: new Date(query.to)}
      }
      if (Validators.checkField(query.id)) {
        or._id = query.id;
      }
      if (Validators.checkField(query.isTableOrders)) {
        if (query.isTableOrders) {
          or.tableId = { $ne: "" }
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
        or.accountStatus = { $nin: [query.status, "Fechada"] }
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
      let orders = await Orders.find(or)
        .skip((page - 1) * limit )
        .limit(limit)
        .sort(sort);
      if (!orders) {
        ApiResponse.badRequest().sendResponse(res);
      } else {
        ApiResponse.returnSucess(orders).sendResponse(res);
      }
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
      next(e)
    }
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
        const update = await Orders.updateOne(query, {$set: data})
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
