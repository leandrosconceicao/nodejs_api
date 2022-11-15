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
          default: undefined
        },
      },
    ],
  },
  pago: { type: Boolean },
  clientName: { type: String },
  obs: { type: String },
  accountStatus: { type: String },
  operador: { type: String },
  storeCode: { type: String },
  payment: {
    type: [{
        id: String,
        tipo: String,
        operador: String,
        data: String,
        values: {
            type: [{
                form: String,
                value: Number,
            }]
        }
    }]
  },
});

const orders = mongoose.model('pedidos', ordersSchema);
 
export default orders;