import express from 'express';
import EstablishmentsController from '../controllers/establishmentsController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.establishments, EstablishmentsController.findAll)
    .get(`${endpoints.establishments}/:id`, EstablishmentsController.findOne)
    .post(endpoints.establishments, EstablishmentsController.add)
    // .put(endpoints.establishments, EstablishmentsController.update)
    // .delete(endpoints.establishments, EstablishmentsController.deleteProduct)

export default router;