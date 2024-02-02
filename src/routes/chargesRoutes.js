import express from "express";
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
// import paginationAndFilters from "../middlewares/paginationAndFilters.js";
import ChargesController from "../controllers/charges/chargesController.js";

const router = express.Router();

const chargesApi = new ChargesController();

router
    .get(Endpoints.charges, validateToken, chargesApi.findCharges)
    .get(`${Endpoints.charges}/validate_payment/:txid`, chargesApi.validatePaymentChargeV2)
    .post(Endpoints.charges, validateToken, chargesApi.createCharge)
    .put(`${Endpoints.charges}/refund_pix`, validateToken, chargesApi.refundPixCharge)
    .patch(`${Endpoints.charges}/cancel_pix_charge`, chargesApi.cancelPixCharge)
    .post(`${Endpoints.charges}/webhook(/pix)?`, chargesApi.webhook)
    // .patch(Endpoints.paymentForms, paymentControl.addNewForm)
    // .delete(Endpoints.paymentForms, paymentControl.del)

export default router;