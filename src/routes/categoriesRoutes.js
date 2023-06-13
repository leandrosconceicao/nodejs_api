import express from 'express';
import CategoryController from '../controllers/products/categoriesController.js';
import endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';
import paginationAndFilters from "../middlewares/paginationAndFilters.js";

const router = express.Router();

router
    .get(endpoints.categories, validateToken, CategoryController.findAll, paginationAndFilters)
    .post(endpoints.categories, validateToken, CategoryController.add)
    .put(endpoints.categories, validateToken, CategoryController.updateName)
    .patch(endpoints.categories, validateToken, CategoryController.changeOrder)
    .delete(endpoints.categories, validateToken, CategoryController.delete)

export default router;