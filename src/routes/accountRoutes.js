import express from "express";
import AccountsController from "../controllers/accounts/accountsController.js";
import Endpoints from "../models/Endpoints.js";
import validateToken from "../middlewares/tokenController.js";
import paginationAndFilters from "../middlewares/paginationAndFilters.js";

const router = express.Router();

router
    .get(Endpoints.accounts, AccountsController.findAll, paginationAndFilters)
    .get(`${Endpoints.accounts}/:id`, AccountsController.findOne)
    .post(Endpoints.accounts, validateToken, AccountsController.post)
    .put(`${Endpoints.accounts}/manage_status`, validateToken, AccountsController.manageStatus)

export default router;