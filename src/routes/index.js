import express from "express";
import endpoints from "../models/endpoints.js";
import products from './productsRoutes.js';
import categories from './categoriesRoutes.js';
import response from '../models/ApiResponse.js';
import users from './usersRoutes.js';
import clients from './clientsRoutes.js';
import establishments from './establishmentsRoutes.js';
import menuItems from './menuItemsRoutes.js';
import addOnes from './addOnesRoutes.js';
import orders from './ordersRoutes.js';

const router = (app) => {
    app.route(`${endpoints.home}`).get((req, res) => {
        res.status(200).json(response.returnSucess());
    });

    app.route(`${endpoints.products}`, (req, res) => {
        res.status(200).json(response.returnSucess())
    })

    app.route(`${endpoints.authentication}`, (req, res) => {
        res.status(200).json(response.returnSucess())
    });

    app.route(`${endpoints.establishments}`, (req, res) => {
        res.status(200).json(response.returnSucess())
    });

    app.route(`${endpoints.clients}`, (req, res) => {
        res.status(200).json(response.returnSucess())
    });

    app.route(`${endpoints.categories}`, (req, res) => {
        res.status(200)
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