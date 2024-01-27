import mongoose from "mongoose";
import { paymentSchema } from "./Payments.js";
// var ObjectId = mongoose.Types.ObjectId;

export default mongoose.model("cardPaymentsControl", new mongoose.Schema({
    // _id: {type: ObjectId, unique: true},
    createDate: {type: Date, default: () => { return new Date() }},
    updated_at: {type: Date},
    paymentId: {type: String, required: true, unique: true},
    status: { type: String,
        default: 'processing',
        enum: {
            values: ['processing', 'finished', 'cancelled'],
            message: "O tipo {VALUE} não é um valor permitido"
        }
    },
    paymentData: paymentSchema
}));