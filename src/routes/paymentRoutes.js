import express from "express";
import PaymentController from '../controllers/payments/paymentController.js';
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";
import ChargesController from "../controllers/charges/chargesController.js";

const router = express.Router();

const paymentControl = new PaymentController();
const paymentApi = new ChargesController();

router
    .get(Endpoints.payments, validateToken, paymentControl.findAll, paginationAndFilters)
    .post(`${Endpoints.payments}/create_charge`, paymentApi.createCharge)
    // .get(`${Endpoints.payments}/get_charge`, paymentApi.getCharge)
    .get(`${Endpoints.payments}/:id`, validateToken, paymentControl.findOne)
    .post(Endpoints.payments, validateToken, paymentControl.add)
    .delete(Endpoints.payments, validateToken, paymentControl.rollbackPayments)
    // .patch(Endpoints.paymentForms, paymentControl.addNewForm)
    // .delete(Endpoints.paymentForms, paymentControl.del)

export default router;