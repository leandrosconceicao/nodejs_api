import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    storeCode: {type: String, unique: true},
    paymentForms: {
      type: [{
        type: String,
        default: "money",
        enum: ["money", "credit", "pix", "debit"],
      }],
      default: ["money"]
    },
});

const AppConfig = mongoose.model("configs", configSchema);

export default AppConfig;
