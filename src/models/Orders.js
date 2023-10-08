import mongoose from "mongoose";
import orders_products_schema from "./orders/orders_products.js";
var ObjectId = mongoose.Types.ObjectId;

const ordersSchema = new mongoose.Schema({
  // _id: {type: mongoose.Types.ObjectId},
  pedidosId: {type: Number},
  accountId: { 
    type: ObjectId, ref: 'accounts'
  },
  createDate: { type: Date },
  updated_at: {type: Date},
  orderType: { type: String,
    default: 'frontDesk',
    enum: {
      values: ['frontDesk', 'account', 'delivery'],
      message: "O tipo {VALUE} não é um valor permitido"
    }
  },
  accepted: { type: Boolean , default: null},
  status: {
    type: "String",
    default: "pending",
    enum: {
      values: ['pending', 'cancelled', 'finished', 'onTheWay'],
      message: "o status {VALUE} não é um valor permitido"
    }
  },
  products: {
    type: [
      orders_products_schema
    ],
  },
  isPayed: { type: Boolean , default: false},
  client: {
    type: ObjectId, ref: "clients", required: [true, "Parametro (client) é obrigatório"]
  },
  deliveryAddress: {
    id: String,
    address: String,
    city: String,
    complement: String,
    distric: String,
    number: String,
    state: String,
    zipCode: String,
    versionKey: false,
  },
  observations: { type: String , default: ""},
  userCreate: {
    type: ObjectId, ref: "users", required: [true, "Parametro (userCreate) é obrigatório"]
  },
  storeCode: {type: mongoose.Types.ObjectId, ref: "establishments" , required: [true, "Parametro (storeCode) é obrigatório"]},
  payment: {
    type: ObjectId, ref: 'payments'
  },
  versionKey: false,
});

const orders = mongoose.model("orders", ordersSchema);

export default orders;
