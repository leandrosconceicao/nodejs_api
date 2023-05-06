import express from "express";
// import validateToken from "../middlewares/tokenController.js";
import ConfigController from '../controllers/configs/configController.js';
import Endpoints from "../models/Endpoints.js";

const router = express.Router();

const configController = new ConfigController();
router
    .get(`${Endpoints.configs}/:storeCode`, configController.findOne)
    .post(Endpoints.configs, configController.add)
    .delete(Endpoints.configs, configController.del)
    // .get(`${Endpoints.configs}/:id`, validateToken, ConfigController.findOne)
    // .post(Endpoints.configs, validateToken, ConfigController.add)
    // .put(Endpoints.configs, validateToken, ConfigController.update)
    // .delete(Endpoints.configs, ConfigController.delete
// )

export default router;