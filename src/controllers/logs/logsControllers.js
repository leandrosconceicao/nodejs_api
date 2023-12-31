import Logs from "../../models/Logs.js";

class LogsController {

    async saveReqLog(req, err, action) {
        try {
            return await Logs({
                route: req.url,
                method: req.method,
                request_headers: req.headers,
                request_body: req.body,
                error: err,
                action: action
            }).save()            
        } catch (_) {
            // console.log(e)
        }
    }
}

export default LogsController;