import express from 'express';
import ClientController from '../controllers/clientsController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.clients, ClientController.findAll)
    .get(`${endpoints.clients}/:id`, ClientController.findOne)
    .post(endpoints.clients, ClientController.add)
    .post(`${endpoints.clients}/authentication`, ClientController.authentication)
    .put(endpoints.clients, ClientController.update)
    .delete(endpoints.clients, ClientController.delete)

export default router;