import express from "express";
import CardPaymentController from "../controllers/payments/cardPaymentController.js";

const endpoint = "/card_payment";

export default express.Router()
    .get(`${endpoint}/check/:id`, CardPaymentController.checkPayment)
    .get(`${endpoint}/:id`, CardPaymentController.getPayment)
    .post(`${endpoint}/webhook`, CardPaymentController.webhook)
    .post(endpoint, CardPaymentController.createPayment)
    .delete(endpoint, CardPaymentController.cancelPayment)
    .patch(`${endpoint}/device_operation_mode`, CardPaymentController.setDeviceOperationMode)