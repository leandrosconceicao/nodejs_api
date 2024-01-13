import mongoose from 'mongoose';
import InvalidParameter from "../errors/InvalidParameter.js";
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
            req.query = Apps.find(query);
            next();
        } catch (e) {
            next(e);
        }
    }

    static async findOne(req, res, next) {
        try {
            let id = req.params.id;
            const data = await Apps.findById(id);
            return ApiResponse.returnSucess(data).sendResponse(res);
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
            delete data._id;
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
                return ApiResponse.parameterNotFound('id').sendResponse(res);
            } else {
                const r = await Apps.findByIdAndDelete(id);
                if (!r) {
                    return ApiResponse.badRequest().sendResponse(res);
                } else {
                    return ApiResponse.returnSucess().sendResponse(res);
                }
            }
        } catch (e) {   
            next(e);
        }
    }

    static async validateVersion(req, res, next) {
        try {
            const {appName, version} = req.query;
            if (!Validators.checkField(appName)) {
                throw new InvalidParameter("appName");
            }
            if (!Validators.checkField(version)) {
                throw new InvalidParameter("version");
            }
            const app = await Apps.findOne({
                appsName: appName,
            });
            if (!app) {
                return ApiResponse.badRequest("App não localizado").sendResponse(res);
            }
            const versionCheck = parseInt(version.replaceAll(".", ""));
            const serverVersion = parseInt(app.version.replaceAll(".", ""));
            const hasNewVersion =  serverVersion > versionCheck;
            if (hasNewVersion) {
                return ApiResponse.badRequest("Há uma nova versão do aplivativo disponível para atualização").sendResponse(res);
            }
            return ApiResponse.returnSucess().sendResponse(res);
        } catch (e) {
            next(e);
        }
    }
}


export default AppsController;