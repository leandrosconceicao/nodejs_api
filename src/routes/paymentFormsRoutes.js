import express from "express";
import PaymentFormController from '../controllers/paymentForms/paymentFormController.js';
import Endpoints from "../models/Endpoints.js";

const router = express.Router();

const paymentFormControl = new PaymentFormController();
router
    .get(`${Endpoints.paymentForms}/:storeCode`, paymentFormControl.findOne)
    .post(Endpoints.paymentForms, paymentFormControl.add)
    .patch(Endpoints.paymentForms, paymentFormControl.addNewForm)
    .delete(Endpoints.paymentForms, paymentFormControl.del)

export default router;