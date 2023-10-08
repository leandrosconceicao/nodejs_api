import Validators from "../../utils/utils.js";
import ApiResponse from "../../models/ApiResponse.js";
import Accounts from "../../models/Accounts.js";
import OrdersController from "../../controllers/orders/ordersController.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import PaymentController from "../payments/paymentController.js";
import mongoose from "mongoose";
import TelegramApi from "../telegram/telegramController.js";
var ObjectId = mongoose.Types.ObjectId;
class AccountsController {
    static async findAll(req, res, next) {
        try {
            const {storeCode, status, from, to, created_by} = req.query;
            let query = {};
            if (!Validators.checkField(storeCode)) {
                throw new InvalidParameter("storeCode");
            } else {
                query.storeCode = storeCode;
            }
            if (Validators.checkField(status)) {
                query.status = status;
            }
            if (Validators.checkField(from) && Validators.checkField(to)) {
                query.createDate = {$gte: new Date(from), $lte: new Date(to)};
            }
            if (Validators.checkField(created_by)) {
                query.created_by = new ObjectId(created_by)
            }
            req.query = Accounts.find(query)
                .populate("client")
                .populate("created_by", ["-establishments", "-pass"]);
            next();
        } catch (e) {
            next(e);
        }
    }

    static async findOne(req, res, next) {
        try {
            const id = req.params.id;
            if (!Validators.checkField(id)) {
                throw new InvalidParameter('id');
            }
            const account = await getAccountData(id);
            return ApiResponse.returnSucess(account).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async post(req, res, next) {
        try {
            let newAccount = new Accounts(req.body);
            newAccount.createDate = new Date();
            await newAccount.save();
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async manageStatus(req, res, next) {
        try {
            const {id, status} = req.body;
            if (!Validators.checkField(id)) {
                throw new InvalidParameter("id");
            }
            if (!Validators.checkField(status)) {
                throw new InvalidParameter("status");
            }
            await Accounts.findByIdAndUpdate(new ObjectId(id), {status: status});
            if (status === "checkSolicitation") {
                sendAccountOrders(id);
            }
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async canReceiveNewOrder(id) {
        const account = await Accounts.findById(id, {status: -1})
        return account.status == "open";
    }
    
}

async function sendAccountOrders(id) {
    try {
        const account = await getAccountData(id);
        if (!account) {
            return;
        }
        if (!account.orders.length) {
            return;
        }
        const telApi = new TelegramApi();
        await telApi.notifyUsers(prepareAccountData(account));
    } catch (e) {
        console.log(e);
    }
}

function prepareAccountData(account) {
    let data = "";
    let products = account.orders.map((e) => `${e.products.map((prod) => `(${prod.quantity} x R$ ${prod.unitPrice}) ${prod.productName} = R$ ${prod.quantity * prod.unitPrice}\n`)}\n\n`)
    // let payments = account.payments.map((e) => `(${e.value.form}) - R$ ${e.value.value}\n`);
    data += `<b>EXTRATO DA CONTA: ${account.description}</b>\n`
    data += products;
    let total = account.orders.map((e) => e.products.map((el) => el.unitPrice * el.quantity).reduce((total, current) => total + current, 0))
    data += `Total: R$ ${total.reduce((total, current) => total + current, 0)}`
    // if (payments.length) {
    //     data += payments
    // }
    return data;
}

async function getAccountData(id) {
    let account = await Accounts.findById(id)
        .populate("client")
        .populate("created_by", ["-establishments", "-pass"])
        .lean();
    if (!account) {
        throw new NotFoundError("Conta não localizada");
    }
    const orders = await OrdersController.getOrders(id);
    const payments = await PaymentController.getPayments(id);
    account.orders = orders;
    account.payments = payments;
    return account;
}

export default AccountsController;