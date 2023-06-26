import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // _id: {type: String},
    email: {type: String, unique: true},
    pass: {type: String},
    group_user: {type: String, default: '1',
    enum: {
        values: ['1', '2', '99'],
        message: "O tipo {VALUE} não é um valor permitido"
        }
    },
    username: {type: String},
    isActive: {type: Boolean, default: false},
    establishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "establishments"
    }],
    token: {type: String, default: ""},
});

const users = mongoose.model('users', userSchema)

export default users;
