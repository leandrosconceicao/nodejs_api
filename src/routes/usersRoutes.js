import express from "express";
import UserController from "../controllers//users/userController.js";
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";


const router = express.Router();

router
    .get(Endpoints.users, validateToken, UserController.findAll, paginationAndFilters)
    .get(`${Endpoints.users}/:id`, validateToken, UserController.findOne)
    .post(Endpoints.users, validateToken, UserController.add)
    .delete(Endpoints.users, validateToken, UserController.delete)
    .patch(`${Endpoints.users}/change_password`, validateToken, UserController.updatePass)
    .patch(Endpoints.users, validateToken, UserController.update)
    .post(Endpoints.authentication, UserController.authenticate)

export default router;