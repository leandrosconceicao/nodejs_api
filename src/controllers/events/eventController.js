import ApiResponse from "../../models/ApiResponse.js";
import orders from "../../models/Orders.js";
import Validators from "../../utils/utils.js";

var cachedOrder = null;

class EventsController {
  static send = async (req, res) => {
    let storeCode = req.query.storeCode;
    if (!Validators.checkField(storeCode)) {
      res.status(406).json(ApiResponse.parameterNotFound("storeCode"));
    } else {
      console.log(`Client connected ${req.headers}`)
      res.set("Content-Type", "text/event-stream");
      res.set("Connection", "keep-alive");
      res.set("Cache-Control", "no-cache");
      res.set("Access-Control-Allow-Origin", "*");
      setInterval(async () => {
        let query = await orders
          .find({ storeCode: storeCode })
          .sort({ data: -1 })
          .limit(5);
        if (query.length) {
          let newData = query.splice(-1)[0];
          if (cachedOrder == null) {
            cachedOrder = newData;
          } else if (cachedOrder.id != newData.id) {
            cachedOrder = newData;
            res.status(200).write(`data: ${JSON.stringify(newData)}\n\n`);
          }
        }
      }, 3600);
    }
  };
}

export default EventsController;
