import express from "express";
import endpoints from "../models/endpoints.js";
import products from './productsRoutes.js';
import response from '../models/api_response.js';
import users from './usersRoutes.js';
import establishments from './establishmentsRoutes.js';

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

    app.use(
        express.json(),
        products,
        users,
        establishments,
    )
}

export default router;