import express from "express";
import CardPaymentController from "../controllers/payments/cardPaymentController.js";

export default express.Router()
    .get("/card_payment/:id", CardPaymentController.getPayment)
    .post("/card_payment", CardPaymentController.createPayment)
    .delete("/card_payment", CardPaymentController.cancelPayment)
    .patch("/card_payment/device_operation_mode", CardPaymentController.setDeviceOperationMode)