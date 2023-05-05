import mongoose from "mongoose";
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

const Recipes = mongoose.model('bakeryrecipes', recipeSchema);

export default Recipes;