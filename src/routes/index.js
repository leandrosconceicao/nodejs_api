import express from "express";
import products from './productsRoutes.js';
import categories from './categoriesRoutes.js';
import response from '../models/ApiResponse.js';
import users from './usersRoutes.js';
import clients from './clientsRoutes.js';
import establishments from './establishmentsRoutes.js';
import menuItems from './menuItemsRoutes.js';
import addOnes from './addOnesRoutes.js';
import orders from './ordersRoutes.js';
import ApiResponse from "../models/ApiResponse.js";

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
    )
}

export default router;