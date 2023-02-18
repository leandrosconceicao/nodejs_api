import mongoose from "mongoose";

const appsSchema = new mongoose.Schema({
    appsName: {type: String},
    version: {type: String},
    releaseDate: {type: Date}
})

const apps = mongoose.model('apps', appsSchema)

export default apps;