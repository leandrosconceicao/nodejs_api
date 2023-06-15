import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String},
    email: {type: String},
    pass: {type: String},
    group_user: {type: String},
    username: {type: String},
    ativo: {type: Boolean},
    establishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "establishments"
    }],
    token: {type: String},
});

const users = mongoose.model('users', userSchema)

export default users;
