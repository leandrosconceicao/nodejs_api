import express from "express";
import validateToken from "../middlewares/tokenController.js";
import AppsController from '../controllers/apps/appsControllers.js';
import Endpoints from "../models/Endpoints.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";

const router = express.Router();

router
    .get(Endpoints.apps, validateToken, AppsController.findAll, paginationAndFilters)
    .get(`${Endpoints.apps}/:id`, validateToken, AppsController.findOne)
    .post(Endpoints.apps, validateToken, AppsController.add)
    .put(Endpoints.apps, validateToken, AppsController.update)
    .delete(Endpoints.apps, validateToken, AppsController.delete)

export default router;