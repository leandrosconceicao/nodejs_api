import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    seq_value: {type: Number},
});


const Counter = mongoose.model("counters", counterSchema);

export default Counter;