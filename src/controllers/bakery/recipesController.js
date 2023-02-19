import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import Recipes from '../../models/bakery/Recipes.js';
import TokenGenerator from "../../utils/tokenGenerator.js";

class RecipeController {
    static async findAll(req, res) {
        try {
            let query = req.query;
            if (!Validators.checkField(query.storeCode)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
            }
            const recipes = await Recipes.find(query);
            return res.status(200).json(ApiResponse.returnSucess(recipes));
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
            if (!Validators.checkField(body.name)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(name)'))
            }
            const newRecipe = new Recipes(body);
            newRecipe._id = TokenGenerator.generateId();
            let process = await newRecipe.save();
            return res.status(200).json(ApiResponse.returnSucess(process));
        } catch (e) {
            return res.status(200).json(ApiResponse.dbError(e));
        }
    }

    static async delete(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body._id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(_id)'));
            }
            const process = await Recipes.findByIdAndDelete(body._id);
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
            const process = await Recipes.findByIdAndUpdate(body._id, body.data);
            if (!process) {
                return res.status(400).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess());
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async updateIngredients(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body._id)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(_id)'));
            }
            if (!Validators.checkField(body.movement) || (body.movement != "in" && body.movement != "out")) {
                return res.status(406).json(ApiResponse.parameterNotFound('(movement)'))
            }
            if (!Validators.checkField(body.item)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(item)'))
            }
            let move = body.movement == "in" ? {$push: { ingredients: body.item }} : {$pull: {ingredients:  {_id: body.item._id}}};
            const recipe = await Recipes.findByIdAndUpdate(body._id, move);
            if (!recipe) {
                return res.status(400).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess());
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
}

export default RecipeController;