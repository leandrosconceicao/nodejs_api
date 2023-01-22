import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
  // _id: { type: String},
  tableDescription: { type: String },
  tableId: { type: String },
  date: { type: Date },
  orderType: { type: String },
  accepted: { type: Boolean },
  deliveryStatus: {type: String},
  products: {
    type: [
      {
        id: String,
        quantity: Number,
        productName: String,
        productId: Number,
        orderDescription: String,
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
      },
    ],
  },
  isPayed: { type: Boolean },
  client: {
    _id: { type: String },
    name: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: String },
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
  clientName: { type: String },
  obs: { type: String },
  accountStatus: { type: String },
  saller: { type: String },
  storeCode: { type: String },
  payment: {
    id: String,
    tipo: String,
    operador: String,
    data: String,
    values: {
      type: [
        {
          form: String,
          value: Number,
        },
      ],
    },
  },
  versionKey: false,
});

const orders = mongoose.model("pedidos", ordersSchema);

export default orders;
