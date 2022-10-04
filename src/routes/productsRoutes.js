import express from 'express';
import ProductController from '../controllers/productController.js';
import endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(endpoints.products, ProductController.findAll)
    .post(endpoints.products, ProductController.addProduct)
    .put(endpoints.products, ProductController.update)
    .delete(endpoints.products, ProductController.deleteProduct)
    .delete(endpoints.product_images, ProductController.deleteImage)

export default router;