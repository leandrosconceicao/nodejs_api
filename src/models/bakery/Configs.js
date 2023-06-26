import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    storeCode: {type: mongoose.Types.ObjectId, ref: "establishments", required: [true, "Parametro (storeCode) é obrigatório"], unique: true},
    daysOfWork: {type: Number, default: 0},
    hoursPerDay: {type: Number, default: 0},
    averageGain: {type: mongoose.Types.Decimal128, default: 0},
    averageGainPerTime: {type: mongoose.Types.Decimal128, defualt: 0},
    averageTimeInMinutes: {type: Number, default: 0}
})

const BakeryConfig = mongoose.model('bakeryConfig', configSchema)

export default BakeryConfig;

