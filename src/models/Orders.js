import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
  // _id: {type: mongoose.Types.ObjectId},
  pedidosId: {type: Number},
  tableDescription: { type: String },
  tableId: { type: String },
  date: { type: Date , default: new Date()},
  orderType: { type: String,
    default: 'frontDesk',
    enum: {
      values: ['frontDesk', 'account', 'delivery'],
      message: "O tipo {VALUE} não é um valor permitido"
    }
  },
  accepted: { type: Boolean },
  lastModified: {
    date: {type: Date},
    user: {type: String},
  },
  total: {type: Number},
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
      {
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
    type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true
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
  obs: { type: String },
  accountStatus: { type: String },
  saller: { type: String },
  storeCode: { type: String },
  payment: {
    tipo: String,
    operador: String,
    data: {type: Date},
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

const orders = mongoose.model("orders", ordersSchema);

export default orders;
