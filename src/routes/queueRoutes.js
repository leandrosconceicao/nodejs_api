import express from "express";
import QueueService from "../controllers/Queue/QueueController.js";
import Endpoints from "../models/Endpoints.js";



const router = express.Router();

router
    .get(Endpoints.queue, QueueService.findAll)
    .get(`${Endpoints.queue}/:storeCode`, QueueService.generate)
    .delete(`${Endpoints.queue}/:storeCode`, QueueService.delete)

export default router;