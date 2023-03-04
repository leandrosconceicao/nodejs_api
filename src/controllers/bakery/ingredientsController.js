import ApiResponse from '../../models/ApiResponse.js';
import TokenGenerators from '../../utils/tokenGenerator.js';
import Validators from '../../utils/utils.js';
import { Ingredients } from '../../models/bakery/Ingredients.js';

class IngredientsController {
    static async findAll(req, res) {
        try {
            let query = req.query;
            if (!Validators.checkField(query.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            const ingredients = await Ingredients.find(query);
            if (!ingredients) {
                res.status(400).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess(ingredients));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async save(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            if (!Validators.checkField(body.name)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(name)'))
            }
            const ingredients = new Ingredients(body);
            ingredients._id = TokenGenerators.generateId()
            let process = await ingredients.save();
            if (!process) {
                return res.status(500).json(ApiResponse.dbError(process)); 
            }
            return res.status(200).json(ApiResponse.returnSucess());
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async delete(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body._id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(_id)'))
            }
            let process = await Ingredients.findByIdAndRemove(body._id);
            if (!process) {
                return res.status(400).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess(process));
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
            const process = await Ingredients.findByIdAndUpdate(body._id, body.data);
            if (!process) {
                return res.status(400).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess());
        } catch (e) {   
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
}

export default IngredientsController;