import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const pixPaymentsSchema = new mongoose.Schema({
    storeCode: {type: ObjectId, ref: "establishments", required: [true, "Parametro (storeCode) é obrigatório"]},
    createDate: {type: Date, default: new Date()},
    userCreate: {type: ObjectId, ref: "users", required: [true, "Parametro (userCreate) é obrigatório"]},
    txId: {type: String, required: true},
    endToEndId: {type: String},
    status: { type: String,
        default: 'processing',
        enum: {
          values: ['processing', 'finished', 'cancelled'],
          message: "O tipo {VALUE} não é um valor permitido"
        }
      }
})

const PixPayments = mongoose.model("pixPayments", pixPaymentsSchema);

export default PixPayments;