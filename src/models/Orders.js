import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const ordersSchema = new mongoose.Schema({
  // _id: {type: mongoose.Types.ObjectId},
  pedidosId: {type: Number},
  accountId: { 
    type: ObjectId, ref: 'accounts'
  },
  createDate: { type: Date },
  orderType: { type: String,
    default: 'frontDesk',
    enum: {
      values: ['frontDesk', 'account', 'delivery'],
      message: "O tipo {VALUE} não é um valor permitido"
    }
  },
  accepted: { type: Boolean , default: undefined},
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
      new mongoose.Schema({
        quantity: Number,
        productName: String,
        productId: ObjectId,
        orderDescription: String,
        category: String,
        needsPreparation: Boolean,
        setupIsFinished: Boolean,
        unitPrice: Number,
        addOnes: {
          type: [
            {
              addOneName: String,
              quantity: Number,
              name: String,
              price: Number,
            },
          ],
          default: undefined,
        },
      }),
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
  observations: { type: String },
  userCreate: {
    type: ObjectId, ref: "users", required: [true, "Parametro (storeCode) é obrigatório"]
  },
  storeCode: {type: mongoose.Types.ObjectId, ref: "establishments" , required: [true, "Parametro (storeCode) é obrigatório"]},
  payment: {
    type: ObjectId, ref: 'payments'
  },
  versionKey: false,
});

const orders = mongoose.model("orders", ordersSchema);

export default orders;
