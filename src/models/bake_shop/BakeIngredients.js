import mongoose from "mongoose";

const ingredientsSchema = new mongoose.Schema({
    _id: {type: String},
    unity: {type: String},
    quantity: {type: Number},
    cost: {tpye: Number},
})

const Ingredients = mongoose.model('ingredients', ingredientsSchema)

export default Ingredients;

