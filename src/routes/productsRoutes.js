import express from 'express';
import ProductController from '../controllers/productController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.products, ProductController.findAll)
    .post(endpoints.products, ProductController.pushProduct)
    .put(endpoints.products, ProductController.updateProduct)
    .delete(endpoints.products, ProductController.deleteProduct)

export default router;