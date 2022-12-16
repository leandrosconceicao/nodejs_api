import mongoose from "mongoose";

const establishmentsSchema = new mongoose.Schema({
    _id: {type: Number},
    storeName: {type: String},
    stores: {
        type: [{
            id: String,
            location: String,   
            url: String,
            isOpen: Boolean,
        }],
        default: undefined
    },
    ownerId: {type: String},
    logo: {type: String},
    visibles: {
        showCardInfo: {type: Boolean},
        showSocialNetWork: {type: Boolean},
        showTipInfo: {type: Boolean},
    }
}, {
    versionKey: false,
})

const establishments = mongoose.model('estabelecimentos', establishmentsSchema);

export default establishments;