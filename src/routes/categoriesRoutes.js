import express from 'express';
import CategoryController from '../controllers/products/categoriesController.js';
import endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';

const router = express.Router();

router
    .get(endpoints.categories, validateToken, CategoryController.findAll)
    .post(endpoints.categories, validateToken, CategoryController.add)
    .put(endpoints.categories, validateToken, CategoryController.update)
    .delete(endpoints.categories, validateToken, CategoryController.delete)

export default router;