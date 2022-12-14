import express from 'express';
import ClientController from '../controllers/clients/clientsController.js';
import endpoints from '../models/endpoints.js';
// import validateToken from "../middlewares/tokenController.js";

const router = express.Router();

router
    .get(endpoints.clients_forgot_password, ClientController.forgotPassword)
    .post(`${endpoints.clientsValidation}/:id`, ClientController.validate)
    .patch(`${endpoints.clients_recover_password}`, ClientController.recoverPassword)

export default router;