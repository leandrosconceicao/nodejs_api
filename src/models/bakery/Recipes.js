import mongoose from "mongoose";
import TokenGenerator from "../../utils/tokenGenerator.js";
import {ingredientsBody} from './Ingredients.js';

const recipeSchema = new mongoose.Schema({
    _id: {type: String},
    storeCode: {type: String, required: true},
    name: {type: String, required: true},
    createdAt: {type: Date, default: new Date()},
    ingredients: {
        type: [ingredientsBody]
    }
})

const Recipes = mongoose.model('recipes', recipeSchema);

export default Recipes;