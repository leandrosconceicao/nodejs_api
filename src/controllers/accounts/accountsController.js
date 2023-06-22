import Validators from "../../utils/utils.js";
import ApiResponse from "../../models/ApiResponse.js";
import Accounts from "../../models/bakery/Accounts.js";
import OrdersController from "../../controllers/orders/ordersController.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import PaymentController from "../payments/paymentController.js";

class AccountsController {
    static async findAll(req, res, next) {
        try {
            const {storeCode, status, from, to} = req.query;
            let query = {};
            if (Validators.checkField(storeCode)) {
                query.storeCode = storeCode;
            }
            if (Validators.checkField(status)) {
                query.status = status;
            }
            if (Validators.checkField(from) && Validators.checkField(to)) {
                query.createDate = {$gte: new Date(from), $lte: new Date(to)};
            }
            req.query = Accounts.find(query)
                .populate("client");
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
            let account = await Accounts.findById(id)
                .populate("client").lean();
            if (!account) {
                throw new NotFoundError("Conta não localizada");
            }
            const orders = await OrdersController.getOrders(id);
            const payments = await PaymentController.getPayments(id);
            account.orders = orders;
            account.payments = payments;
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
}

export default AccountsController;