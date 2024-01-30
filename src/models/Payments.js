import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const paymentSchema = new mongoose.Schema({
    // _id: {type: ObjectId},
    accountId: {
        type: ObjectId, ref: 'accounts'
    },
    refunded: {type: Boolean, default: false},
    storeCode: {type: mongoose.Types.ObjectId, ref: "establishments", required: [true, "Parametro (storeCode) é obrigatório"]},
    userCreate: {type: ObjectId, ref: "users", required: [true, "Parametro (userCreate) é obrigatório"]},
    createDate: {type: Date, default: () => { return new Date() }, required: [true, "Parametro (createDate) é obrigatório"]},
    userUpdated: {type: ObjectId, ref: "users",},
    updateDate: {type: Date},
    value: {
        type: {
            txId: {type: String, default: undefined},
            cardPaymentId: {type: String, default: undefined},
            form: String,
            value: Number,
        },
        required: [true, "Parametro (value) é obrigatório"]
    }
});

const Payments = mongoose.model("payments", paymentSchema);

export {Payments, paymentSchema};