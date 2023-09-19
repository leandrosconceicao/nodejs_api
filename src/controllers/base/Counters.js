import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    seq_value: {type: Number},
    createDate: {type: Date}
});


const Counter = mongoose.model("counters", counterSchema);

export default Counter;