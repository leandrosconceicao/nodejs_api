import express from 'express';
import EstablishmentsController from '../controllers/establishments/establishmentsController.js';
import endpoints from '../models/endpoints.js';
import validateToken from '../middlewares/tokenController.js';
const router = express.Router();

router
    .get(endpoints.establishments,  EstablishmentsController.findAll)
    .get(`${endpoints.establishments}/:id`, EstablishmentsController.findOne)
    .post(endpoints.establishments, validateToken, EstablishmentsController.add)
    .delete(endpoints.establishments, validateToken, EstablishmentsController.del)
    .patch(endpoints.establishments, validateToken, EstablishmentsController.patch)

export default router;