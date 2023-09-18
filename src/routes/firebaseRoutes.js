import express from "express";
import Endpoints from "../models/Endpoints.js";
import Notifications from "../controllers/firebase/notifications.js";
import validateToken from "../middlewares/tokenController.js";

const router = express.Router();

const notifications = new Notifications();

router.post(Endpoints.notifications, validateToken, notifications.post)

export default router;