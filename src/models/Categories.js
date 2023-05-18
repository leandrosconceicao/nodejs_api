import mongoose from 'mongoose';

const categorieSchema = new mongoose.Schema({
    _id: {type: Number},
    nome: {type: String, required: [true, "Parametro (nome) é obrigatório"]},
    storeCode: {type: String, required: [true, "Parametro (storeCode) é obrigatório"]},
    ordenacao: {type: Number, required: [true, "Parametro (ordenacao) é obrigatório"]},
    image: {type: String}
});

const categories = mongoose.model('categorias', categorieSchema)

export default categories;
