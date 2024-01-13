import mongoose from "mongoose";
import BillingPeriods from "../../models/BillingPeriods.js";
var ObjectId = mongoose.Types.ObjectId;
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";

export default class BillingPeriodsController {

    static async open(req, res, next) {
        try {
            const body = req.body;
            const billing = await new BillingPeriods(body).save();
            return ApiResponse.returnSucess(billing).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async findAll(req, res, next) {
        try {
            const {storeCode, dateTo, dateFrom} = req.query;
            if (!Validators.checkField(storeCode)) {
                throw new InvalidParameter("storeCode");
            }
            let query = {
                storeCode: new ObjectId(storeCode),
            };
            if (Validators.checkField(dateFrom) && Validators.checkField(dateTo)) {
                query.dateFrom = {
                    $gte: new Date(dateFrom)
                };
                query.dateTo = {
                    $lte: new Date(dateTo)
                }
            }
            const billing = await BillingPeriods.find(query).populate("storeCode")
            .populate('userCreate', ["-establishments", "-pass"])
            .populate('userUpdate', ["-establishments", "-pass"]);
            return ApiResponse.returnSucess(billing).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async close(req, res, next) {
        try {
            const {id, dateTo, isOpen, user} = req.body;
            if (!Validators.checkField(id)) {
                throw new InvalidParameter("id");
            }
            if (!Validators.checkField(dateTo)) {
                throw new InvalidParameter("dateTo");
            }
            if (isOpen === undefined) {
                throw new InvalidParameter("isOpen");
            }
            if (!ObjectId.isValid(user)) {
                throw new InvalidParameter("userUpdate");
            }
            const billing = await BillingPeriods.findOneAndUpdate({
                _id: new ObjectId(id),
            }, {
                dateTo: dateTo,
                isOpen: isOpen,
                userUpdate: new ObjectId(user),
                updated_at: new Date(),
            });
            return ApiResponse.returnSucess(billing).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }
}