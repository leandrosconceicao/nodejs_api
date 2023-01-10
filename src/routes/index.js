import express from "express";
import products from './productsRoutes.js';
import categories from './categoriesRoutes.js';
import users from './usersRoutes.js';
import clients from './clientsRoutes.js';
import establishments from './establishmentsRoutes.js';
import menuItems from './menuItemsRoutes.js';
import addOnes from './addOnesRoutes.js';
import orders from './ordersRoutes.js';
import ApiResponse from "../models/ApiResponse.js";
import events from "./eventsRoutes.js";
import validation from "./validationsRoutes.js";
import queue from './queueRoutes.js';

const router = (app) => {

    app.get('/', (req, res) => {
        res.status(200).json(ApiResponse.returnSucess())
    })

    app.use(
        express.json(),
        addOnes,
        menuItems,
        products,
        categories,
        users,
        establishments,
        clients,
        orders,
        events,
        validation,
        queue
    )
}

export default router;