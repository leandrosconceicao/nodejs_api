import express from "express";
import UserController from "../controllers//users/userController.js";
import Endpoints from "../models/endpoints.js";
import validateToken from "../middlewares/tokenController.js";


const router = express.Router();

router
    .get(Endpoints.users, validateToken, UserController.findAll)
    .post(Endpoints.users, validateToken, UserController.add)
    .delete(Endpoints.users, validateToken, UserController.delete)
    .post(Endpoints.authentication, UserController.authenticate)

export default router;