import mongoose from "mongoose";

const appsSchema = new mongoose.Schema({
    appsName: {type: String,
        required: [true, "Parametro (appsName) é obrigatório"]
    },
    version: {type: String,
        required: [true, "Parametro (version) é obrigatório"]
    },
    releaseDate: {type: Date,
        required: [true, "Parametro (releaseDate) é obrigatório"]
    }
})

const apps = mongoose.model('apps', appsSchema)

export default apps;