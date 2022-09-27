import express from "express";
import UserController from "../controllers/userController.js";
import Endpoints from "../models/endpoints.js";

const router = express.Router();

router
    .get(Endpoints.users, UserController.findAll)
    .post(Endpoints.users, UserController.add)
    .delete(Endpoints.users, UserController.delete)
    .post(Endpoints.authentication, UserController.authenticate)

export default router;