import express from "express";
import Endpoints from "../models/Endpoints.js";
// import validateToken from "../middlewares/tokenController.js";
// import paginationAndFilters from "../middlewares/paginationAndFilters.js";
import ChargesController from "../controllers/chargesController/chargesController.js";

const router = express.Router();

const chargesApi = new ChargesController();

router
    .get(Endpoints.charges, chargesApi.findCharges)
    .get(`${Endpoints.charges}/validate_payment/:txid`, chargesApi.validatePaymentCharge)
    .post(Endpoints.charges, chargesApi.createCharge)
    .put(`${Endpoints.charges}/refund_pix`, chargesApi.refundPixCharge)
    // .patch(Endpoints.paymentForms, paymentControl.addNewForm)
    // .delete(Endpoints.paymentForms, paymentControl.del)

export default router;