import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    _id: {type: String},
    total: {type: Number},
    date: {type: Date},
    storeCode: {type: String}

})
// const menuItems = mongoose.model('menuItems', menuItemsSchema, 'categorias')
const TotalSales = mongoose.model('totalSales', salesSchema, 'pedidos')

export default TotalSales;