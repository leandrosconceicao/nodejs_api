import express from 'express';
import CategoryController from '../controllers/categoriesController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.categories, CategoryController.findAll)
    .post(endpoints.categories, CategoryController.add)
    .put(endpoints.categories, CategoryController.update)
    .delete(endpoints.categories, CategoryController.delete)

export default router;