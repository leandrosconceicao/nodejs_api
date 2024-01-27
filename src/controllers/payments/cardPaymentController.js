import ApiResponse from "../../models/ApiResponse.js";
import mongoose from "mongoose";
import { validate as uuidValidate } from "uuid";
import * as dotenv from "dotenv";
import axios from "axios";
import InvalidParameter from "../errors/InvalidParameter.js";
import MercadoPagoError from "../errors/MercadopagoError.js";
import CardPayments from "../../models/CardPayments.js";
import { Payments } from "../../models/Payments.js";
// import { paymentSchema } from "../../models/Payments.js";

var ObjectId = mongoose.Types.ObjectId;

var isValidObjectId = mongoose.isValidObjectId;


dotenv.config();

const ENDPOINT = process.env.MERCARDOPAGO_API;
const TOKEN = process.env.MERCADOPAGO_TOKEN;
const DEVICE_ID = process.env.MERCADOPAGO_DEVICE_ID;

const types = ["credit_card", "debit_card"];
const opModes = ["PDV", "STANDALONE"];

export default class cardPaymentController {
  static async getPayment(req, res, next) {
    try {
      const id = req.params.id;
      if (!uuidValidate(id)) {
        throw new InvalidParameter("id");
      }
      const pixIntent = await request(
        "GET",
        `${ENDPOINT}/payment-intents/${id}`
      );
      return ApiResponse.returnSucess(pixIntent.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async createPayment(req, res, next) {
    try {
      const { amount, description, type, storeCode, userCreate, accountId} = req.body;
      if (!isValidObjectId(userCreate)) {
        throw new InvalidParameter("userCreate");
      }
      if (!isValidObjectId(storeCode)) {
        throw new InvalidParameter("storeCode");
      }
      if (accountId) {
        if (!isValidObjectId(accountId)) {
          throw new InvalidParameter("accountId");
        }
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
      const newId = new ObjectId();

      paymentIntent.additional_info = {
        "external_reference": newId.toString(),
        print_on_terminal: true,
      };
      const cardPayment = await new CardPayments({
        status: "processing",
        paymentId: new ObjectId(newId),
        paymentData: new Payments({
          storeCode: storeCode,
          userCreate: userCreate,
          value: {
            form: type == "debit_card" ? "debit" : "credit",
            value: amount * 0.01
          },
          accountId: accountId,
          
        })
      }).save();
      // const payIntentRequest = await request(
      //   "POST",
      //   `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents`,
      //   paymentIntent
      // );
      return ApiResponse.returnSucess(cardPayment).sendResponse(res);
      // return ApiResponse.returnSucess(payIntentRequest.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async cancelPayment(req, res, next) {
    try {
      const { id } = req.body;
      if (!id) {
        throw new InvalidParameter(`ID => valor informado: ${id}`);
      }
      if (typeof id !== "string") {
        throw new InvalidParameter(`ID => valor informado: ${id}`);
      }
      const payIntentCancel = await request(
        "DELETE",
        `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents/${id}`
      );
      return ApiResponse.returnSucess(payIntentCancel.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async setDeviceOperationMode(req, res, next) {
    try {
      const { mode } = req.body;
      if (!opModes.includes(mode)) {
        throw new InvalidParameter(
          `informado: ${mode}, valores permitidos ${opModes}`
        );
      }
      const opModeRequest = await request(
        "PATCH",
        `${ENDPOINT}/devices/${DEVICE_ID}`,
        {
          operating_mode: mode,
        }
      );
      return ApiResponse.returnSucess(opModeRequest.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

async function request(method, url, body) {
  try {
    return await axios({
      method: method,
      url: url,
      headers: {
        "x-test-scope": "sandbox",
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
      data: body,
    });
  } catch (e) {
    throw new MercadoPagoError(e);
  }
}
