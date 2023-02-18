import express from "express";
import validateToken from "../middlewares/tokenController.js";
import AppsController from '../controllers/apps/appsControllers.js';
import Endpoints from "../models/endpoints.js";

const router = express.Router();

router
    .get(Endpoints.apps, AppsController.findAll)
    .get(`${Endpoints.apps}/:id`, validateToken, AppsController.findOne)
    .post(Endpoints.apps, validateToken, AppsController.add)
    .put(Endpoints.apps, validateToken, AppsController.update)
    .delete(Endpoints.apps, AppsController.delete)

export default router;