import Validators from "../../utils/utils.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";
import Counter from "../base/Counters.js";
import PaymentController from "../payments/paymentController.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import PeriodGenerator from "../../utils/periodGenerator.js";
import mongoose from "mongoose";
import Payments from "../../models/Payments.js";
var ObjectId = mongoose.Types.ObjectId;

class OrdersController {
  static async findOne(req, res, next) {
    try {
      let id = req.params.pedidosId;
      const query = await Orders.findById(id)
        .populate("client")
        .populate("accountId", ["-payments", "-orders"])
        .populate("userCreate", ["-establishments", "-pass"]);
      // .populate('payment')
      // .populate('payment.userCreate', ['-establishments', '-pass']);
      if (!query) {
        throw new NotFoundError("Pedido não encontrado");
      } else {
        ApiResponse.returnSucess(query).sendResponse(res);
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
        clientId,
        paymentId,
        accountId,
        status,
        saller,
        accepted,
        storeCode,
      } = req.query;
      let or = {};
      if (!Validators.checkField(storeCode)) {
        throw new InvalidParameter("storeCode");
      }
      or.storeCode = new ObjectId(storeCode);
      if (Validators.checkField(isPreparation)) {
        or.products = {
          $elemMatch: { setupIsFinished: false, needsPreparation: true },
        };        
        or.status = {
          $nin: ["cancelled", "finished"]
        }
      }
      if (Validators.checkField(type)) {
        or.orderType = type;
      }
      if (Validators.checkField(from) && Validators.checkField(to)) {
        or.createDate = new PeriodGenerator(from, to).buildQuery();
      }
      if (Validators.checkField(id)) {
        or._id = id;
      }
      if (Validators.checkField(clientId)) {
        or.client = {};
        or.client._id = new ObjectId(clientId);
      }
      if (Validators.checkField(accountId)) {
        or.accountId = accountId;
      }
      if (Validators.checkField(saller)) {
        or.saller = saller;
      }
      if (Validators.checkField(accepted)) {
        or.accepted = accepted;
      }
      if (Validators.checkField(status) && !isPreparation) {
        or.status = status;
      }
      if (Validators.checkField(paymentId)) {
        or.payment = new ObjectId(paymentId);
      }
      req.query = Orders.find(or)
        .populate("client")
        .populate("accountId", ["-payments", "-orders"])
        .populate("userCreate", ["-establishments", "-pass"]);
      // .populate('payment')
      // .populate('payment.userCreate', ['-establishments', '-pass']);
      next();
    } catch (e) {
      return next(e);
    }
  }

  static async post(req, res, next) {
    try {
      let body = req.body;
      if (!Validators.checkField(body.storeCode)) {
        throw new InvalidParameter("storeCode");
      } else {
        let order = new Orders(body);
        order.createDate = new Date();
        if (Validators.checkField(body.orderType) && body.orderType == "frontDesk") {
          const payment = await PaymentController.savePayment(body.payment);
          order.payment = payment._id;
        }
        let or = await order.save();
        await OrdersController.updateId(or);
        const newOrder = await Orders.findById(or.id)
          .populate("client")
          .populate("accountId", ["-payments", "-orders"])
          .populate("userCreate", ["-establishments", "-pass"]);
        // .populate('payment')
        // .populate('payment.userCreate', ['-establishments', '-pass']);
        ApiResponse.returnSucess(newOrder).sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }

  static async getOrders(id) {
    const data = await Orders.find({
      accountId: new ObjectId(id),
      status: { $ne: "cancelled" },
    })
      .populate("client")
      .populate("accountId", ["-payments", "-orders"])
      .populate("userCreate", ["-establishments", "-pass"]);
    return data;
  }

  static async updateId(order) {
    let count = 0;
    let counter = await Counter.find({});
    if (!counter.length) {
      count += 1;
    } else {
      count = counter[0].seq_value + 1;
    }
    await Orders.findByIdAndUpdate(order.id, { pedidosId: count });
    await Counter.updateMany({}, { seq_value: count });
  }

  static async pushNewItems(req, res, next) {
    try {
      let { id, orders } = req.body;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound("id").sendResponse(res);
      }
      if (!Validators.checkField(orders)) {
        return ApiResponse.parameterNotFound("orders").sendResponse(res);
      }
      const order = await Orders.findByIdAndUpdate(id, {
        $push: { products: orders },
      });
      return ApiResponse.returnSucess(order).sendResponse(res);
    } catch (e) {
      return next(e);
    }
  }

  static async addPayment(req, res, next) {
    try {
      const { id, data } = req.body;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound("id").sendResponse(res);
      }
      if (!Validators.checkField(data)) {
        return ApiResponse.parameterNotFound("data").sendResponse(res);
      }
      data.createDate = new Date();
      await Orders.findByIdAndUpdate(id, {
        payment: data,
      });
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async cancelOrder(req, res, next) {
    try {
      const id = req.body;
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      const orderUpdate = await Orders.findByIdAndUpdate(new ObjectId(id), {
        status: "cancelled",
        isPayed: false,
      });
      await Payments.findByIdAndDelete(orderUpdate.payment);
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  // static async update(req, res, next) {
  //   try {
  //     let query = req.body.query
  //     let data = req.body.data;
  //     if (!Validators.checkField(query)) {
  //       ApiResponse.parameterNotFound('(query)').sendResponse(res);
  //     } else if (!Validators.checkField(data)) {
  //       ApiResponse.parameterNotFound('(data)').sendResponse(res);
  //     } else {
  //       const update = await Orders.updateMany(query, {$set: data})
  //       if (!update) {
  //         ApiResponse.returnError('Nenhum dado atualizado, verifique os filtros').sendResponse(res);
  //       } else {
  //         ApiResponse.returnSucess().sendResponse(res);
  //       }
  //     }
  //   } catch (e) {
  //     return next(e)
  //   }
  // }

  static async setPreparation(req, res, next) {
    try {
      let query = req.body;
      if (!Validators.checkField(query.id)) {
        throw new InvalidParameter("id");
      }
      if (!Validators.checkField(query.isReady) && !Validators.checkType(query.isReady, "boolean")) {
        throw new InvalidParameter("isReady");
      }
      await Orders.findByIdAndUpdate(query.id, {
        status: "finished",
        "products.$[].setupIsFinished": query.isReady,
      });
      ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      return next(e);
    }
  }
}

export default OrdersController;
