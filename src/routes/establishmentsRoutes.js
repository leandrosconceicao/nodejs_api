import express from 'express';
import EstablishmentsController from '../controllers/establishments/establishmentsController.js';
import Endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';
import paginationAndFilters from "../middlewares/paginationAndFilters.js";
const router = express.Router();

router
    .get(Endpoints.establishments,  EstablishmentsController.findAll, paginationAndFilters)
    .get(`${Endpoints.establishments}/:id`, EstablishmentsController.findOne)
    .post(Endpoints.establishments, validateToken, EstablishmentsController.add)
    .delete(Endpoints.establishments, validateToken, EstablishmentsController.del)
    .put(Endpoints.establishments, validateToken, EstablishmentsController.update)
    // .patch(Endpoints.establishments, validateToken, EstablishmentsController.manageStore)

export default router;