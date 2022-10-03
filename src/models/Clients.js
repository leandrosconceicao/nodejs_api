import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
    _id: {type: String},
    name: {type: String, required: true},
    cgc: {type: String, required: true},
    email: {type: String, required: true},
    clientAddress: {
        clientAddress: [{
            id: String,
            address: String,
            complement: String,
            number: String,
            state: String,
            zipCode: String,
        }],
    }
})

const clients = mongoose.model('clients', clientsSchema)

export default clients;
