import express from 'express';
import ClientController from '../controllers/clients/clientsController.js';
import endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';
import paginationAndFilters from '../middlewares/paginationAndFilters.js';
const router = express.Router();

router
    .get(endpoints.clients, validateToken, ClientController.findAll, paginationAndFilters)
    .get(`${endpoints.clients}/:id`, ClientController.findOne)
    .post(endpoints.clients, ClientController.add)
    .post(`${endpoints.clients}/authentication`, ClientController.authentication)
    .put(endpoints.clients, ClientController.update)
    .delete(endpoints.clients, validateToken, ClientController.delete)

export default router;