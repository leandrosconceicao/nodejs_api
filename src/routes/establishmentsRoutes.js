import express from 'express';
import EstablishmentsController from '../controllers/establishmentsController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.establishments, EstablishmentsController.findAll)
    .get(`${endpoints.establishments}/:id`, EstablishmentsController.findOne)
    .post(endpoints.establishments, EstablishmentsController.add)
    .delete(endpoints.establishments, EstablishmentsController.del)
    .patch(endpoints.establishments, EstablishmentsController.patch)
    // .put(endpoints.establishments, EstablishmentsController.update)

export default router;