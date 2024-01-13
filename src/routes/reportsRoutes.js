import express from 'express';
import ReportsControllers from '../controllers/reports/reportsController.js';
import Endpoints from "../models/Endpoints.js"
import validateToken from '../middlewares/tokenController.js';

const router = express.Router();

router
    .get(Endpoints.quantSales, validateToken, ReportsControllers.quantifySales)
    .get(Endpoints.quantSalesByProduct, validateToken, ReportsControllers.quantifySalesByProduct)
    .get(`${Endpoints.reports}/average_preparation_time`, ReportsControllers.averagePreparationTime)

export default router;