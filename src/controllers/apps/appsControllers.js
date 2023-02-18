import ApiResponse from '../../models/ApiResponse.js';
import Apps from '../../models/Apps.js';
import Validators from '../../utils/utils.js';


class AppsController {
    
    static async findAll(req, res) {
        try {
            let body = req.query;
            let query = {};
            if (Validators.checkField(body.id)) {
                query['_id'] = body.id;
            } else if (Validators.checkField(body.name)) {
                query['appsName'] = body.name;
            } else if (Validators.checkField(body.version)) {
                query['version'] = body.version;
            }
            const data = await Apps.find(query);
            return res.status(200).json(ApiResponse.returnSucess(data));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async findOne(req, res) {
        try {
            let id = req.params.id;
            if (!Validators.checkField(id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(id)'));
            }
            const data = await Apps.findById(id);
            return res.status(200).json(ApiResponse.returnSucess(data));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async add(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.name)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(name)'));
            } else if (!Validators.checkField(body.releaseDate)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(releaseDate)'));
            } else if (!Validators.checkField(body.version)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(version)'))
            } else {
                const app = new Apps(body);
                const proccess = await app.save();
                if (!proccess) {
                    return res.status(500).json(ApiResponse.dbError(proccess));
                } else {
                    return res.status(200).json(ApiResponse.returnSucess());
                }
            }
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async update(req, res) {
        try {
            let id = req.body.id;
            let data = req.body.data;
            const dt = await Apps.findByIdAndUpdate(id, {$set: data});
            if (!dt) {
                return res.status(400).json(ApiResponse.returnError("Nenhum dado atualizado"));
            } else {
                return res.status(200).json(ApiResponse.returnSucess());
            }
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async delete(req, res) {
        try {
            let id = req.body.id;
            if (!Validators.checkField(id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(id)'));
            } else {
                const r = Apps.findByIdAndDelete(id);
                if (!r) {
                    return res.status(400).json(ApiResponse.returnError("Nenhum dado excluido, verifique os filtros e tente novamente."))
                } else {
                    return res.status(200).json(ApiResponse.returnSucess());
                }
            }
        } catch (e) {   
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
}


export default AppsController;