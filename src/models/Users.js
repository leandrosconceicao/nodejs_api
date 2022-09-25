import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String},
    email: {type: String},
    pass: {type: String},
    group_user: {type: String},
    username: {type: String},
    ativo: {type: Boolean},
    establishments: {type: Array},
    token: {type: String},
});

const users = mongoose.model('usuarios', userSchema)

export default users;
