import Validators from '../../utils/utils.js';
import TokenGenerator from '../../utils/tokenGenerator.js';
import Configs from '../../models/bakery/Configs.js';
import ApiResponse from '../../models/ApiResponse.js';

class ConfigsController {

    static async findOne(req, res) {
        try {
            let storeCode = req.params.storeCode;
            if (!Validators.checkField(storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            const config = await Configs.findOne({storeCode: storeCode});
            let data = {};
            data.averageGain = parseFloat(config.averageGain);
            data.averageGainPerTime = parseFloat(config.averageGainPerTime);
            data.daysOfWork = config.daysOfWork;
            data.hoursPerDay = config.hoursPerDay;
            data.storeCode = config.storeCode;
            return res.status(200).json(ApiResponse.returnSucess(data));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }


    static async findAll(req, res) {
        try {
            let query = req.query;
            if (!Validators.checkField(query.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            let configs = await Configs.find(query);
            return res.status(200).json(ApiResponse.returnSucess(configs));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    } 

    static async post(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            let config = new Configs(body);
            config.averageGainPerTime = config.averageGain / (config.daysOfWork * config.hoursPerDay)
            config.averageTimeInMinutes = (config.hoursPerDay * config.daysOfWork * 60);
            let process = await Configs.findOneAndUpdate({storeCode: config.storeCode}, {
                daysOfWork: config.daysOfWork,
                hoursPerDay: config.hoursPerDay,
                averageGain: config.averageGain,
                averageGainPerTime: config.averageGainPerTime,
                averageTimeInMinutes: config.averageTimeInMinutes
            }, {upsert: true})
            return res.status(201).json(ApiResponse.returnSucess(process));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async update(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body._id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(_id)'));
            }
            if (!Validators.checkField(body.data)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(data)'));
            }
            let process = await Configs.findByIdAndUpdate(body._id, body.data);
            return res.status(200).json(ApiResponse.returnSucess(process));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async delete(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body._id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(_id)'));
            }
            let process = await Configs.findByIdAndDelete(body._id);
            return res.status(200).json(ApiResponse.returnSucess(process));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
}

export default ConfigsController;