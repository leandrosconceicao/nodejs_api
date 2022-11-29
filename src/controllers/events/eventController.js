import ApiResponse from "../../models/ApiResponse.js";
import orders from "../../models/Orders.js";
import Validators from "../../utils/utils.js";

var cachedOrder = null;

class EventsController {
    static send = async (req, res) => {
        let storeCode = req.query.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(406).json(ApiResponse.parameterNotFound('storeCode'));
        } else {
            res.set("Content-Type", "text/event-stream");
            res.set("Connection", "keep-alive");
            res.set("Cache-Control", "no-cache")
            res.set("Access-Control-Allow-Origin", "*")
            setInterval(() => {
                let query = orders.find(
                    {"storeCode": storeCode}
                ).sort({data: -1}).limit(5)
                let recentOrder = query.slice(-1);
                if (cachedOrder != recentOrder) {
                    cachedOrder = recentOrder;
                    res.status(200).write(`${req.query.storeId}: ${JSON.stringify(recentOrder)}\n\n`)
                }
            }, 1000)
        }
    }
}

export default EventsController;