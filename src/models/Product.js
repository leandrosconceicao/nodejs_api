import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: Number },
  isActive: { type: Boolean, 
    required: [true, "Parametro (isActive) é obrigatório"] 
  },
  categoria: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.Number, ref: "categorias", required: true
  },
  preco: { type: Number },
  produto: { type: String, 
    required: [true, "Parametro (produto) é obrigatório"],
  },
  descricao: { type: String },
  preparacao: Boolean,
  storeCode: { type: String, required: [true, "Parametro (storeCode) é obrigatório"] },
  addOnes: {
    type: [
      {
        isRequired: Boolean,
        productsAddOnes: {
          _id: String,
          storeCode: String,
          name: String,
          price: Number,
          maxQtdAllowed: Number,
          items: {
            type: [
              {
                name: String,
                price: Number,
              },
            ],
            default: undefined,
          },
        },
      },
    ],
    default: undefined,
  },
  image: {
    name: { type: String, default: undefined },
    link: { type: String, default: undefined },
  },
});

const products = mongoose.model("produtos", productSchema);

export default products;
