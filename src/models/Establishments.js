import mongoose from "mongoose";

const establishmentsSchema = new mongoose.Schema({
    _id: {type: Number},
    storeName: {type: String},
    stores: {
        type: [{
            id: String,
            location: String,   
            url: String,
        }],
        default: undefined
    },
    ownerId: {type: String},
}, {
    versionKey: false,
})

const establishments = mongoose.model('estabelecimentos', establishmentsSchema);

export default establishments;