import express from 'express';
import ProductController from '../controllers/productController.js';
import endpoints from '../models/endpoints.js';
import validateToken from '../middlewares/tokenController.js';

const router = express.Router();

router
    .get(endpoints.products, validateToken, ProductController.findAll)
    .get(`${endpoints.products}/:id`, validateToken, ProductController.findOne)
    .post(endpoints.products, validateToken, ProductController.addProduct)
    .put(endpoints.products, validateToken, ProductController.update)
    .delete(endpoints.products, validateToken, ProductController.deleteProduct)
    .delete(endpoints.product_images, validateToken, ProductController.deleteImage)

export default router;