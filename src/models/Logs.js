import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
    created_at: {type: Date, default: new Date()},
    route: {type: String},
    request_headers: {type: Object},
    request_body: {type: Object},
    method: {type: String},
    error: {type: Object}
});

const logs = mongoose.model('logs', logsSchema);

export default logs;

