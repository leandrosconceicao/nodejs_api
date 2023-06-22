import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

const accountsSchema = new mongoose.Schema({
    description: {type: String, required: [true, "Parametro (description) é obrigatório"] },
    storeCode: { type: String, required: [true, "Parametro (storeCode) é obrigatório"] },
    createDate: {type: Date},
    status: {
        type: String,
        required: true,
        default: 'open',
        enum: {
            values: ['open', 'closed', 'checkSolicitation'],
            message: "O tipo {VALUE} não é um valor de STATUS permitido"
        }
    },
    client: {
        type: ObjectId, ref: 'clients', required: [true, "Parametro (client) é obrigatório"]
    }
})

const Accounts = mongoose.model('accounts', accountsSchema);


export default Accounts;