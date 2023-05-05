import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String},
    email: {type: String},
    pass: {type: String},
    group_user: {type: String},
    username: {type: String},
    ativo: {type: Boolean},
    establishments: {type: Array},
    ests: {
        type: [{
            _id: Number,
            storeName: String,
            stores: {
                type: [{
                    id: String,
                    location: String,
                    url: String,
                    isOpen: Boolean
                }],
                default: undefined
            },
            ownerId: String,
            logo: String,
        }]
    },
    token: {type: String},
});

const users = mongoose.model('usuarios', userSchema)

export default users;
