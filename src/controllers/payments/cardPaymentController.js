import ApiResponse from "../../models/ApiResponse.js";
import mongoose from "mongoose";
import { validate as uuidValidate } from "uuid";
// import crypto from "crypto";
import * as dotenv from "dotenv";
import axios from "axios";
import InvalidParameter from "../errors/InvalidParameter.js";
import MercadoPagoError from "../errors/MercadopagoError.js";
import CardPayments from "../../models/CardPayments.js";
import { Payments } from "../../models/Payments.js";
// import LogController from "../logs/logsControllers.js";
// import { paymentSchema } from "../../models/Payments.js";

var ObjectId = mongoose.Types.ObjectId;

var isValidObjectId = mongoose.isValidObjectId;

// const logControl = new LogController();

const webHookPayStatus = {
  FINISHED: "finished",
  CANCELLED: "cancelled",
  ERROR: "cancelled",
};

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
      const { amount, description, type, storeCode, userCreate, accountId } =
        req.body;
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
          `#Informado: type => [${type}], valores permitidos ${types.join(
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
        external_reference: newId.toString(),
        print_on_terminal: true,
      };
      const payIntentRequest = await request(
        "POST",
        `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents`,
        paymentIntent
      );
      const cardPayment = await new CardPayments({
        status: "processing",
        paymentId: newId,
        paymentData: new Payments({
          storeCode: storeCode,
          userCreate: userCreate,
          value: {
            cardPaymentId: payIntentRequest.data.id,
            form: type == "debit_card" ? "debit" : "credit",
            value: amount * 0.01,
          },
          accountId: accountId,
        }),
      }).save();
      return ApiResponse.returnSucess(cardPayment).sendResponse(res);
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
      await request(
        "DELETE",
        `${ENDPOINT}/devices/${DEVICE_ID}/payment-intents/${id}`
      );
      const process = await CardPayments.findOneAndUpdate(
        {
          "paymentData.value.cardPaymentId": id,
        },
        {
          status: "cancelled",
          updated_at: new Date()
        }
      );
      return ApiResponse.returnSucess(process).sendResponse(res);
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

  static async webhook(req, res) {
    try {
      const { state, id } = req.body;
      let status = webHookPayStatus[state];
      const cardPayment = await CardPayments.findOneAndUpdate(
        {
          "paymentData.value.cardPaymentId": id,
        },
        {
          status: status,
          updated_at: new Date()
        }
      ).lean();
      const newPayment = cardPayment.paymentData;
      delete newPayment._id;
      await new Payments(newPayment).save();
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      return ApiResponse.returnSucess().sendResponse(res);
    }
  }

  static checkPayment(req, res) {
    // let interValID
    try {
      const id = req.params.id;
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders(); // flush the headers to establish SSE with client

      // let counter = 0;
      console.log("Iniciando checagem de pagamento");
      const process = CardPayments.watch([
        {
          $match: {
            "operationType": "update",
            "fullDocument.paymentData.value.cardPaymentId": id
          },
        }
      ], { fullDocument: 'updateLookup' });
      
      process.on("change", (value) => {
        const doc = value.fullDocument;
        res.write(`data: ${JSON.stringify(ApiResponse.returnSucess(doc))}\n\n`); // res.write() instead of res.send()
        if (doc.status != "processing") {
          // res.write(`data: ${JSON.stringify(ApiResponse.returnSucess(doc))}\n\n`); // res.write() instead of res.send()
          // clearInterval(interValID);
          res.end();
          // return;
        }
      });

      process.on("close", () => {
        res.end();
      })
      // process.on("close", () => { 
      //   res.end();
      // })
      // interValID = setInterval(async () => {
      //   // counter++;
      //   // if (counter >= 10) {
      //   //   clearInterval(interValID);
      //   //   res.end(); // terminates SSE session
      //   //   return;
      //   // }
      //   const data = await CardPayments.findOne({
      //     "paymentData.value.cardPaymentId": id
      //   }).lean();
        // if (data.status != "processing") {
        //   res.write(`data: ${JSON.stringify(ApiResponse.returnSucess(data))}\n\n`); // res.write() instead of res.send()
        //   clearInterval(interValID);
        //   res.end();
        //   return;
        // }
      //   // res.write(`data: ${JSON.stringify({num: counter})}\n\n`); // res.write() instead of res.send()
      //   res.write(`data: ${JSON.stringify(ApiResponse.returnSucess(data))}\n\n`); // res.write() instead of res.send()
      // }, 10000);
      
      // If client closes connection, stop sending events
      res.on('close', () => {
        process.close();
        // console.log('client dropped me');
        // clearInterval(interValID);
        res.end();
      });
    } catch (e) {
      // process.close();
      // clearInterval(interValID);
      res.write(`data: ${JSON.stringify(ApiResponse.serverError(e))}\n\n`); // res.write() instead of res.send()
      res.end();
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
