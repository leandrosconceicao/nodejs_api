import mongoose from 'mongoose';

const categorieSchema = new mongoose.Schema({
    _id: {type: Number},
    nome: {type: String},
    storeCode: {type: String, required: true},
    ordenacao: {type: Number, required: true},
    image: {type: String}
});

const categories = mongoose.model('categorias', categorieSchema)

export default categories;
