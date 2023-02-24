import express from "express";
import Endpoints from "../models/Endpoints.js";
import EventsController from "../controllers/events/eventController.js";

const router = express.Router();

router.get(Endpoints.events, EventsController.send)

export default router;