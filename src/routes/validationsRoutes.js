import express from 'express';
import ClientController from '../controllers/clients/clientsController.js';
import validateToken from '../middlewares/tokenController.js';
import Endpoints from "../models/Endpoints.js"

const router = express.Router();

router
    .get(`${Endpoints.clientsValidation}/:id`, ClientController.validate)
    .post(Endpoints.clients_forgot_password, ClientController.forgotPassword)
    .post(Endpoints.clients_recover_password, ClientController.recoverPassword)
    .patch(`${Endpoints.clients_update_password}`, validateToken, ClientController.updatePassword)

export default router;