import ApiResponse from '../../models/ApiResponse.js';
import TokenGenerator from '../../utils/tokenGenerator.js';
import Validators from '../../utils/utils.js';
import Expanse from '../../models/bakery/Expanses.js';

class ExpanseController {

    static async findAll(req, res) {
        try {
            let query = req.query;
            if (!Validators.checkField(query.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            const data = await Expanse.find(query);
            if (!data) {
                return res.status(400).json(ApiResponse.noDataFound())
            }
            return res.status(200).json(ApiResponse.returnSucess(data));
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
            if (!Validators.checkField(body.description)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(description)'));
            }
            const data = new Expanse(body);
            data._id = TokenGenerator.generateId();
            data.save((err) => {
                if (err) {
                    return res.status(500).json(ApiResponse.dbError(err));
                }
                return res.status(201).json(ApiResponse.returnSucess());
            })
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async delete(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(id)'));
            }
            const process = await Expanse.findByIdAndDelete(body.id);
            if (!process) {
                return res.status(400).json(ApiResponse.returnError(''))
            }
            return res.status(200).json(ApiResponse.returnSucess(process));
            
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
}

export default ExpanseController;