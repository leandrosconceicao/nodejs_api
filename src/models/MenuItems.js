import mongoose from 'mongoose';

const menuItemsSchema = new mongoose.Schema({
    nome: {type: String},
    ordenacao: {type: Number},
    products: {
        type: [{
            _id: Number,
            descricao: String,
            preco: Number,
            produto: String
        }],
        default: undefined
    }
});

const menuItems = mongoose.model('menuItems', menuItemsSchema, 'categorias')

export default menuItems;
