import express from "express";
import OrdersController from "../controllers/orders/ordersController.js";
import Endpoints from "../models/endpoints.js";
import validateToken from "../middlewares/tokenController.js";

const router = express.Router();

router
    .get(Endpoints.orders, validateToken, OrdersController.findAll)
    .get(`${Endpoints.orders}/:id`, validateToken, OrdersController.findOne)
    .post(Endpoints.orders, validateToken, OrdersController.post)
    .put(`${Endpoints.orders}/items`, validateToken, OrdersController.put)

export default router;