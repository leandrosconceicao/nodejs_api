import mongoose from "mongoose";

const addOneSchema = new mongoose.Schema({
  _id: { type: String },
  storeCode: { type: String },
  name: { type: String },
  price: { type: Number },
  maxQtdAllowed: { type: Number },
  items: {
    type: [
      {
        name: String,
        price: Number,
      },
    ],
    default: undefined,
  },
});

const addOnes = mongoose.model("addOnes", addOneSchema);

export default addOnes;
