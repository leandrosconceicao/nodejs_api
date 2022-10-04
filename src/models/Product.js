import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    _id: {type: Number},
    isActive: {type: Boolean, required: true},
    categoria: {type: String},
    categoryId: {type: Number},
    preco: {type: Number},
    produto: {type: String, required: true},
    descricao: {type: String},
    preparacao: Boolean,
    storeCode: {type: String, required: true},
    addONes: {
        type: [{
            _id: String,
            isRequired: Boolean,
            maxQuantityAllowed: Number,
            name: String,
            price: Number,
            selectedQuantity: Number,
            storeCode: String,
            totalValue: Number
        }],
        default: undefined
    },
    image: {
        name: {type: String, default: undefined},
        link: {type: String, default: undefined},
    }
});

const products = mongoose.model('produtos', productSchema)

export default products;
