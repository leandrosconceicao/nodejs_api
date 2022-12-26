import mongoose from "mongoose";

const bakeProdSchema = new mongoose.Schema({
    _id: {type: String},
    name: {type: String},
    ingredients: {
        type: [{
            _id: String,
            unity: String,
            quantity: Number,
            cost: Number
        }]
    }
})

const BakeProducts = mongoose.model('bakeProducts', bakeProdSchema);

export default BakeProducts;