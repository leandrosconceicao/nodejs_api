import express from 'express';
import ClientController from '../controllers/clients/clientsController.js';
import endpoints from '../models/endpoints.js';
import validateToken from '../middlewares/tokenController.js';
const router = express.Router();

router
    .get(endpoints.clients, validateToken, ClientController.findAll)
    .get(`${endpoints.clients}/:id`, validateToken, ClientController.findOne)
    .post(endpoints.clients, validateToken, ClientController.add)
    .post(`${endpoints.clients}/authentication`, validateToken, ClientController.authentication)
    .put(endpoints.clients, validateToken, ClientController.update)
    .delete(endpoints.clients, validateToken, ClientController.delete)

export default router;