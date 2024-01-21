import mongoose from "mongoose";

const ingredientsBody = {
    _id: {type: String},
    name: {type: String, required: true},
    storeCode: {type: String, required: true},
    unitOfMeasurement: {type: String, default: "un"},
    quantInPackage: {type: Number, default: 1},
    createdAt: {type: Date, default: () => { return new Date() }},
    cost: {type: Number, default: 0.0},
};
const ingredientsSchema = new mongoose.Schema(ingredientsBody)

const Ingredients = mongoose.model('bakeryingredients', ingredientsSchema)

export {Ingredients, ingredientsBody};

