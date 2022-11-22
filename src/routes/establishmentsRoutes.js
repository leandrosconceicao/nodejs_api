import express from 'express';
import EstablishmentsController from '../controllers/establishmentsController.js';
import endpoints from '../models/endpoints.js';
import validateToken from '../middlewares/tokenController.js';
const router = express.Router();

router
    .get(endpoints.establishments, validateToken,  EstablishmentsController.findAll)
    .get(`${endpoints.establishments}/:id`, validateToken, EstablishmentsController.findOne)
    .post(endpoints.establishments, validateToken, EstablishmentsController.add)
    .delete(endpoints.establishments, validateToken, EstablishmentsController.del)
    .patch(endpoints.establishments, validateToken, EstablishmentsController.patch)

export default router;