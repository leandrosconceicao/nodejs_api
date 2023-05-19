import express from "express";
import OrdersController from "../controllers/orders/ordersController.js";
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";

const router = express.Router();

router
    .get(Endpoints.orders, OrdersController.findAll, paginationAndFilters)
    .get(`${Endpoints.orders}/:pedidosId`, OrdersController.findOne)
    .post(Endpoints.orders, OrdersController.post)
    .put(Endpoints.orders, validateToken, OrdersController.update)
    .put(`${Endpoints.orders}/items`, validateToken, OrdersController.pushNewItems)

export default router;