import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
  _id: { type: String },
  mesa: { type: String },
  idMesa: { type: String },
  diaOperacao: { type: String },
  data: { type: String },
  pedidos: {
    type: [
      {
        id: String,
        qtProdutos: Number,
        opcao: String,
        productId: Number,
        descPedido: String,
        preparacao: Boolean,
        preparacaoConcluida: Boolean,
        valPedido: Number,
        precoUnitario: Number,
        addOnes: {
          type: [
            {
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
  pago: { type: Boolean },
  client: {
    _id: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isValid: { type: Boolean, default: undefined },
    phoneNumber: { type: String },
    address: {
      type: [
        {
          id: String,
          address: String,
          city: String,
          complement: String,
          distric: String,
          number: String,
          state: String,
          zipCode: String,
        },
      ],
      _id: false,
      default: undefined,
      versionKey: false,
    },
  },
  clientName: { type: String },
  obs: { type: String },
  accountStatus: { type: String },
  operador: { type: String },
  storeCode: { type: String },
  payment: {
    type: [
      {
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
    ],
  },
  versionKey: false,
});

const orders = mongoose.model("pedidos", ordersSchema);

export default orders;
