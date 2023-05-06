import ApiResponse from "../../models/ApiResponse.js";
import AppConfig from "../../models/Configs.js";
import Validators from "../../utils/utils.js";

class ConfigController {

    async findOne(req, res) {
        let query = req.params;
        if (!Validators.checkField(query.storeCode)) {
            return res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"))
        }
        let data = await AppConfig.find({storeCode: query.storeCode});
        return res.status(200).json(ApiResponse.returnSucess(data));
    }

    async add(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"));
            }
            if (!Validators.checkField(body.paymentForms)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(paymentForms)'));
            }
            let config = new AppConfig(body)
            let proccess = await config.save();
            if (!proccess) {
                return res.status(400).json(ApiResponse.dbError(proccess));
            }
            return res.status(201).json(ApiResponse.returnSucess());
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e, e.stack))
        }
    }

    async del(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound("(storeCode)"));
            }
            let process = await AppConfig.deleteOne({storeCode: body.storeCode});
            if (!process.deletedCount) {
                return res.status(400).json(ApiResponse.returnError());
            } 
            return res.status(200).json(ApiResponse.returnSucess());

        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e, e.stack));
        }
    }
}

export default ConfigController