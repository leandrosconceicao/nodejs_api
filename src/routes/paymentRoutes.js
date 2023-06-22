import express from "express";
import PaymentController from '../controllers/payments/paymentController.js';
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";

const router = express.Router();

const paymentControl = new PaymentController();

router
    .get(Endpoints.payments, validateToken, paymentControl.findAll, paginationAndFilters)
    .get(`${Endpoints.payments}/:id`, validateToken, paymentControl.findOne)
    .post(Endpoints.payments, validateToken, paymentControl.add)
    .delete(Endpoints.payments, validateToken, paymentControl.delete)
    // .patch(Endpoints.paymentForms, paymentControl.addNewForm)
    // .delete(Endpoints.paymentForms, paymentControl.del)

export default router;