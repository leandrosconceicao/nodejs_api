import Validators from "../../utils/utils.js";
import TelegramApi from "../../controllers/telegram/telegramController.js";
import Orders from "../../models/Orders.js";
import ApiResponse from "../../models/ApiResponse.js";
import Users from "../../models/Users.js";
import Counter from "../base/Counters.js";
import PaymentController from "../payments/paymentController.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import PeriodGenerator from "../../utils/periodGenerator.js";
import mongoose from "mongoose";
import Payments from "../../models/Payments.js";
import AccountsController from "../accounts/accountsController.js";
var ObjectId = mongoose.Types.ObjectId;

const telegramApi = new TelegramApi();

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
      }
      ApiResponse.returnSucess(query).sendResponse(res);
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
        userCreate,
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
      if (Validators.checkField(userCreate)) {
        or.userCreate = new ObjectId(userCreate);
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
      }
      if (!Validators.checkField(body.products)) {
        throw new InvalidParameter("products");
      }
      let order = new Orders(body);
      order.createDate = new Date();
      if (Validators.checkField(body.orderType) && body.orderType == "frontDesk") {
        const payment = await PaymentController.savePayment(body.payment);
        order.payment = payment._id;
      }
      if (body.accountId) {
        const canReceiveNewOrder = await AccountsController.canReceiveNewOrder(body.accountId);
        if (!canReceiveNewOrder) {
          return ApiResponse.badRequest("Conta não pode receber pedidos pois não está com o status de (ABERTA).").sendResponse(res);
        }
      }
      let or = await order.save();
      await OrdersController.updateId(or);
      const newOrder = await Orders.findById(or.id)
        .populate("client")
        .populate("accountId", ["-payments", "-orders"])
        .populate("userCreate", ["-establishments", "-pass"]).lean();
      // .populate('payment')
      // .populate('payment.userCreate', ['-establishments', '-pass']);
      // if (newOrder.accountId) {
      //   telegramApi.notifyUsers(`<b><i>${newOrder.userCreate.username}</i></b> realizou um novo pedido para a conta (<b>${newOrder.accountId.description}</b>)`)
      // }
      ApiResponse.returnSucess(newOrder).sendResponse(res);
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
      const value = counter[0];
      const now = new Date();
      if (value.createDate.toLocaleDateString() !== now.toLocaleDateString()) {
        count += 1;
      } else {
        count = value.seq_value + 1;
      }
    }
    await Orders.findByIdAndUpdate(order.id, { pedidosId: count });
    await Counter.updateMany({}, { seq_value: count, createDate: new Date()}, {
      upsert: true
    });
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

  static async pullItem(req, res, next) {
    try {
      const {id, item_id} = req.body;
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      if (!Validators.checkField(item_id)) {
        throw new InvalidParameter("item_id");
      }
      await Orders.findByIdAndUpdate(id, {
        $pull: {products: {_id: item_id}}
      })
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
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
        updated_at: new Date()
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

  static async changeSeller(req, res, next) {
    try {
      const {orderId, userTo} = req.body;
      if (!Validators.checkField(orderId)) {
        throw new InvalidParameter("orderId");
      }
      if (!Validators.checkField(userTo)) {
        throw new InvalidParameter("userTo");
      }
      await Orders.findByIdAndUpdate(orderId, {
        userCreate: userTo
      });
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async setPreparation(req, res, next) {
    try {
      const {id, isReady} = req.body;
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      if (!Validators.checkField(isReady) && !Validators.checkType(isReady, "boolean")) {
        throw new InvalidParameter("isReady");
      }
      const process = await Orders.findByIdAndUpdate(id, {
        status: isReady ? "finished" : "pending",
        "products.$[].setupIsFinished": isReady,
        updated_at: new Date()
      }, {
        new: true
      }).populate("client")
        .populate("accountId", ["-payments", "-orders"])
        .populate("userCreate", ["-establishments", "-pass"]).lean();
      if (isReady) {
        alertUser(process);
      }
      ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      return next(e);
    }
  }
}

async function alertUser(order) {
  const isAccount = order.orderType == "account";
  if (isAccount) {
    const user = await Users.findById(order.userCreate);
    const msg = `<b><i>${user.username}</i></b>, pedido <b>${order.pedidosId}</b> da conta (<b>${order.accountId.description}</b>) está pronto.`;
    telegramApi.notifyUsers(msg);
  }
}

export default OrdersController;
