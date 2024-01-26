import ApiResponse from "../../models/ApiResponse.js";
import { isValidObjectId } from "mongoose";
// import Validators from "../../utils/utils.js";
import {validate as uuidValidate} from "uuid";
import * as dotenv from "dotenv";
import axios from "axios";
import InvalidParameter from "../errors/InvalidParameter.js";
// import LogsController from "../logs/logsControllers.js";
// import Establishments from "../../models/Establishments.js";

dotenv.config();

// const logControl = new LogsController();

const ENDPOINT = process.env.MERCARDOPAGO_API;
const TOKEN = process.env.MERCADOPAGO_TOKEN;
const DEVICE_ID = process.env.MERCADOPAGO_DEVICE_ID;

// const AGENT = new https.Agent({
//   passphrase: "",
// });
// const testHeaders = {
//     "x-test-scope": "sandbox"
// };

const types = ["credit_card", "debit_card"];
const opModes = ["PDV", "STANDALONE"];

export default class cardPaymentController {

  static async getPayment(req, res, next) {
    try {
      const id = req.params.id;
      if (!uuidValidate(id)) {
        throw new InvalidParameter("id");
      }
      const pixIntent = await axios({
          url: `${ENDPOINT}/payment-intents/${id}`,
          method: "GET",
          headers: {
              "x-test-scope": "sandbox",
              "Content-Type": "application/json",
              Authorization: "Bearer " + TOKEN,
            }
          });
        return ApiResponse.returnSucess(pixIntent.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }


  static async createPayment(req, res, next) {
    try {
      const { amount, description, type, storeCode, userCreate } = req.body;
      if (!isValidObjectId(userCreate)) {
        throw new InvalidParameter("userCreate");
      }
      if (!isValidObjectId(storeCode)) {
        throw new InvalidParameter("storeCode");
      }
      if (typeof amount !== "number") {
        throw new InvalidParameter("amount");
      }
      if (description && typeof description !== "string") {
        throw new InvalidParameter("description");
      }
      if (!types.includes(type)) {
        throw new InvalidParameter(
          `#Informado: type => [${type}], valores necessários ${types.join(
            " ou "
          )}`
        );
      }
      let paymentIntent = {
        additional_info: {
          // "external_reference": "4561ads-das4das4-das4754-das456",
          print_on_terminal: true,
        },
        amount: amount,
        description: description,
        payment: {
          type: type,
        },
      };
      if (type == types[0]) {
        paymentIntent.payment["installments"] = 1;
        paymentIntent.payment["installments_cost"] = "buyer";
      }
      const payIntentRequest = await axios({
        method: "POST",
        url: `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents`,
        headers: {
          "x-test-scope": "sandbox",
          "Content-Type": "application/json",
          Authorization: "Bearer " + TOKEN,
        },
        data: paymentIntent
      });
      return ApiResponse.returnSucess(payIntentRequest.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async cancelPayment(req, res, next) {
    try {
      const {id} = req.body;
      if (typeof id !== "string") {
        throw new InvalidParameter(`ID => valor informado: ${id}`)
      }
      const payIntentCancel = await axios({
        method: "DELETE",
        url: `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents/${id}`,
        headers: {
          "x-test-scope": "sandbox",
          Authorization: "Bearer " + TOKEN,
        },
      })
      return ApiResponse.returnSucess(payIntentCancel.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async setDeviceOperationMode(req, res, next) {
    try {
      const {mode} = req.body;
      if (!opModes.includes(mode)) {
        throw new InvalidParameter(`informado: ${mode}, valores permitidos ${opModes}`);
      }
      const opModeRequest = await axios({
        method: "PATCH",
        url: `${ENDPOINT}/devices/${DEVICE_ID}`,
        data: {
          "operating_mode": mode
        },
        headers: {
          "x-test-scope": "sandbox",
          Authorization: "Bearer " + TOKEN,
        },
      });
      return ApiResponse.returnSucess(opModeRequest.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}
