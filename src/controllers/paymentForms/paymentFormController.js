import mongoose from "mongoose";
import ApiResponse from "../../models/ApiResponse.js";
import PaymentForm from "../../models/PaymentForms.js";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";
var ObjectId = mongoose.Types.ObjectId;

const forms = ["money", "credit", "pix", "debit"];

class PaymentFormController {

    async findOne(req, res, next) {
        try {
            let id = req.params.storeCode;
            if (!Validators.checkField(id)) {
                throw new InvalidParameter('storeCode');
            }
            const data = await PaymentForm.findOne({storeCode: id});
            ApiResponse.returnSucess(data).sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    async add(req, res, next) {
        try {
            const body = req.body;
            let config = new PaymentForm(body)
            await config.save();
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    async addNewForm(req, res, next) {
        try {
            const {movement, storeCode, data} = req.body;
            if (!Validators.checkField(storeCode)) {
                throw new InvalidParameter('storeCode');
            }
            if (!Validators.checkField(data)) {
                throw new InvalidParameter('data');
            }
            if (!Validators.checkField(movement) || (movement != "pull" && movement != "push")) {
                throw new InvalidParameter('movement');
            }
            if (!forms.includes(data.form)) {
                throw new InvalidParameter('data.form');
            }
            const process = movement == "push" ? {
                $addToSet: {forms: data}
            } : {
                $pull: {forms: {_id: new ObjectId(data.id)}}
            }
            let update = await PaymentForm.updateOne({storeCode: storeCode}, process);
            if (!update.modifiedCount) {
                return ApiResponse.badRequest("Forma de pagamento já cadastrada").sendResponse(res);
            }
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    async del(req, res, next) {
        try {
            const {storeCode} = req.body;
            if (!Validators.checkField(storeCode)) {
                throw new InvalidParameter('storeCode');
            }
            await PaymentForm.deleteOne({storeCode: storeCode});
            ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    // async updateForm(req, res, next) {
    //     try {
            
    //     } catch (e) {
    //         next(e);
    //     }
    // }
}

export default PaymentFormController