import express from "express";
import OrdersController from "../controllers/ordersController.js";
import Endpoints from "../models/endpoints.js";

const router = express.Router();

router
    .get(Endpoints.orders, OrdersController.findAll)
    .get(`${Endpoints.orders}/:id`, OrdersController.findOne)

export default router;