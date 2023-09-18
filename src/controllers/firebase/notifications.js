import admin from "../../../config/firebaseConfig.js";
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

class Notifications {
  async post(req, res, next) {
    try {
      const { token, title, body, data } = req.body;
      if (!Validators.checkField(token)) {
        throw new InvalidParameter("token");
      }
      if (!Validators.checkField(title)) {
        throw new InvalidParameter("title");
      }
      if (!Validators.checkField(body)) {
        throw new InvalidParameter("body");
      }
      await Notifications.sendTo(token, title, body, data);
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async sendTo(token, title, body, data) {
    let notificationData = {
      notification: {
        title: title,
        body: body,
      },
    }
    if (data) {
      notificationData.data = data
    }
    await admin.messaging().sendToDevice(
      token,
      notificationData,
      notification_options
    );
  }
}

export default Notifications;
