import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const counterSchema = new mongoose.Schema({
    seq_value: {type: Number},
    createDate: {type: Date},
    storeCode: {type: ObjectId, ref: 'counters'}
});


const Counter = mongoose.model("counters", counterSchema);

export default Counter;