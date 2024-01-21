import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

export default mongoose.model("billingPeriods", new mongoose.Schema({
    dateFrom: {type: Date, default: () => { return new Date() }, required: [true, "Parametro (dateFrom) é obrigatório"]},
    dateTo: {type: Date},
    isOpen: {type: Boolean, default: true},
    storeCode: { type: ObjectId, ref: "establishments", required: [true, "Parametro (storeCode) é obrigatório"] },
    userCreate: {type: ObjectId, ref: "users", required: [true, "Parametro (userCreate) é obrigatório"]},
    userUpdate: {type: ObjectId, ref: "users"},
    created_at: {type: Date, default: () => { return new Date() }},
    updated_at: {type: Date},
}));
