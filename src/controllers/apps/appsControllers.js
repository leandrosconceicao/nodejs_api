import mongoose from 'mongoose';
import ApiResponse from '../../models/ApiResponse.js';
import Apps from '../../models/Apps.js';
import Validators from '../../utils/utils.js';


class AppsController {
    
    static async findAll(req, res, next) {
        try {
            let body = req.query;
            let query = {};
            if (Validators.checkField(body.id)) {
                query._id = body.id;
            } else if (Validators.checkField(body.name)) {
                query.appsName = body.name;
            } else if (Validators.checkField(body.version)) {
                query.version = body.version;
            }
            const data = await Apps.find(query);
            return res.status(200).json(ApiResponse.returnSucess(data));
        } catch (e) {
            next(e);
        }
    }

    static async findOne(req, res, next) {
        try {
            let id = req.params.id;
            const data = await Apps.findById(id);
            return res.status(200).json(ApiResponse.returnSucess(data));
        } catch (e) {
            next(e);
        }
    }

    static async add(req, res, next) {
        try {
            let body = req.body;
            const app = new Apps(body);
            await app.save();
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }

    static async update(req, res, next) {
        try {
            let id = req.body.id;
            let data = req.body.data;
            if (!id) {
                throw new mongoose.Error.ValidationError();
            }
            const dt = await Apps.findByIdAndUpdate(id, {$set: data});
            if (!dt) {
                return res.status(400).json(ApiResponse.returnError("Nenhum dado atualizado"));
            } else {
                return res.status(200).json(ApiResponse.returnSucess());
            }
        } catch (e) {
            next(e);
        }
    }

    static async delete(req, res, next) {
        try {
            let id = req.body.id;
            if (!Validators.checkField(id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(id)'));
            } else {
                const r = Apps.findByIdAndDelete(id);
                if (!r) {
                    return res.status(400).json(ApiResponse.returnError("Nenhum dado excluido, verifique os filtros e tente novamente."));
                } else {
                    return res.status(200).json(ApiResponse.returnSucess());
                }
            }
        } catch (e) {   
            next(e);
        }
    }
}


export default AppsController;