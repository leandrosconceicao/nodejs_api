import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const paymentSchema = new mongoose.Schema({
    accountId: {
        type: ObjectId, ref: 'accounts'
    },
    storeCode: {type: String, required: [true, "Parametro (storeCode) é obrigatório"]},
    userCreate: {type: ObjectId, ref: "users", required: [true, "Parametro (userCreate) é obrigatório"]},
    createDate: {type: Date, required: [true, "Parametro (createDate) é obrigatório"]},
    value: {
        type: {
            form: String,
            value: Number,
        },
        required: [true, "Parametro (value) é obrigatório"]
    }
});

const Payments = mongoose.model("payments", paymentSchema);

export default Payments;