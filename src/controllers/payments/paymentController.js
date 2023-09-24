import ApiResponse from "../../models/ApiResponse.js";
import Payments from "../../models/Payments.js";
import Validators from "../../utils/utils.js";
import InvalidParameters from "../errors/InvalidParameter.js";
import NotFoundError from "../errors/NotFoundError.js";
import PeriodGenerator from "../../utils/periodGenerator.js";
import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

class PaymentController {
    async findAll(req, res, next) {
        try {
            const {storeCode, userCreate, to, from, type} = req.query;
            const query = {};
            if (!Validators.checkField(storeCode)) {
                throw new InvalidParameters("storeCode");
            }
            query.storeCode = storeCode;
            if (Validators.checkField(to) && Validators.checkField(from)) {
                const period = new PeriodGenerator(from, to);
                query.createDate = period.buildQuery();
            }
            if (Validators.checkField(userCreate)) {
                query.userCreate = userCreate;
            }
            if (Validators.checkField(type)) {
                query.value = {
                    form: type
                }
            }
            req.query = Payments.find(query).populate('userCreate', ["-establishments", "-pass"]);
            next();
        } catch (e) {
            next(e);
        }
    }
    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const payment = await Payments.findById(id).populate("userCreate", ["-establishments", "-pass"]);
            if (!payment) {
                throw NotFoundError("Pagamento não localizado");
            }
            return ApiResponse.returnSucess(payment).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }
    
    async add(req, res, next) {
        try {
            const payment = await PaymentController.savePayment(req.body);
            const parsePayment = await payment.populate("userCreate", ["-establishments", "-pass"]);
            return ApiResponse.returnSucess(parsePayment).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body;
            if (!Validators.checkField(id)) {
                throw new InvalidParameters("id");
            }
            await Payments.findByIdAndDelete(id);
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    async rollbackPayments(req, res, next) {
        try {
            const {payments} = req.body;
            if (!Validators.checkField(payments)) {
                throw new InvalidParameters("payments");
            }
            await Payments.deleteMany({
                _id: {"$in": payments}
            });
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async savePayment(paymentData) {
        const payment = new Payments(paymentData);
        payment.createDate = new Date();
        if (Validators.checkField(paymentData.accountId)) {
            payment.accountId = paymentData.accountId;
        }
        const process = await payment.save();
        return process;
    }

    static async getPayments(accountId) {
        const data = await Payments.find({accountId: new ObjectId(accountId)}).populate('userCreate', ["-establishments", "-pass"]);
        return data;
    }
}

export default PaymentController;