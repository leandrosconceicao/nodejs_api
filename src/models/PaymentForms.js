import mongoose from "mongoose";

const paymentFormSchema = new mongoose.Schema({
    storeCode: {type: String, unique: true, required: [true, "Parametro (storeCode) é obrigatório"]},
    forms: {
      type: [new mongoose.Schema({
        isActive: {
          type: Boolean,
          default: true,
        },
        form: {
          type: String,
          default: "money",
        },
        tax: {
          type: Number,
          default: 0.0
        },
        _id : false 
      })],
      default: [],
    },
});

const PaymentForm = mongoose.model("paymentform", paymentFormSchema);

export default PaymentForm;
