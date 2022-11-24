import express from "express";
import MenuItemsController from "../controllers/products/menuItemsController.js";
import Endpoints from "../models/endpoints.js";

const router = express.Router();

router
    .get(Endpoints.menu_items, MenuItemsController.get)

export default router;