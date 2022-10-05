import express from 'express';
import AddOneController from '../controllers/addOnesController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.add_ones, AddOneController.findAll)
    .post(endpoints.add_ones, AddOneController.add)
    .put(endpoints.add_ones, AddOneController.update)
    .delete(endpoints.add_ones, AddOneController.delete)

export default router;