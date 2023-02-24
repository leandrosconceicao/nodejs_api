import express from "express";
import MenuItemsController from "../controllers/products/menuItemsController.js";
import Endpoints from "../models/Endpoints.js";

const router = express.Router();

router
    .get(Endpoints.menu_items, MenuItemsController.get)

export default router;