import ApiResponse from "../../models/ApiResponse.js";
import {Payments} from "../../models/Payments.js";
import Validators from "../../utils/utils.js";
import InvalidParameters from "../errors/InvalidParameter.js";
import NotFoundError from "../errors/NotFoundError.js";
import PeriodGenerator from "../../utils/periodGenerator.js";
import mongoose from "mongoose";
import ChargesController from "../charges/chargesController.js";
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
            const {payments, userId} = req.body;
            if (!Validators.checkField(userId)) {
                throw new InvalidParameters("userId");
            }
            if (!Validators.checkField(payments)) {
                throw new InvalidParameters("payments");
            }
            let pays = await Payments.find({
                _id: {"$in": payments}
            }).lean();
            let filtredData = pays.filter((e) => !e.refunded);
            if (!filtredData.length) {
                return ApiResponse.badRequest("Pagamentos já foram estornados").sendResponse(res);
            }
            await Payments.updateMany({
                _id: {"$in": filtredData.map((e) => e._id)}
            }, {
                $set: {
                    refunded: true,
                    userUpdated: new ObjectId(userId),
                    updateDate: new Date()
                }
            });
            await cancelCharge(filtredData)
            filtredData.forEach((e) => {
                delete e._id;
                e.value.value = e.value.value * (-1);
                e.refunded = true
            })
            let refunds = filtredData.map((e) =>  Payments(e));
            await Payments.insertMany(refunds);
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async savePayment(paymentData) {
        if (paymentData.value.txId) {
            const payment = await Payments.findOne({
                "value.txId": paymentData.value.txId
            })
            return payment;
        }
        const payment = new Payments(paymentData);
        payment.createDate = new Date();
        if (Validators.checkField(paymentData.accountId)) {
            payment.accountId = paymentData.accountId;
        }
        const process = await payment.save();
        return process;
    }

    static async getAccountPayments(accountId) {
        const data = await Payments.find({accountId: new ObjectId(accountId)}).populate('userCreate', ["-establishments", "-pass"]);
        return data;
    }
}

async function cancelCharge(filtredData) {
    for (let i = 0; i < filtredData.length; i++) {
        let data = filtredData[i];
        const TX_ID = data.value.txId;
        if (TX_ID) {
            await ChargesController.cancelPixCharge(TX_ID)
        }
    }
}

export default PaymentController;