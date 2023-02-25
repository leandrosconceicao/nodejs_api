import express from 'express';
import AddOneController from '../controllers/products/addOnesController.js';
import endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';

const router = express.Router();

router
    .get(endpoints.add_ones, AddOneController.findAll)
    .post(endpoints.add_ones, validateToken, AddOneController.add)
    .put(endpoints.add_ones, validateToken, AddOneController.update)
    .patch(endpoints.add_ones, validateToken, AddOneController.patch)
    .delete(endpoints.add_ones, validateToken, AddOneController.delete)

export default router;