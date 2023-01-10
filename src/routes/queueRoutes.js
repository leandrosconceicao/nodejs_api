import express from "express";
import QueueService from "../controllers/Queue/queueController.js";
import Endpoints from "../models/endpoints.js";



const router = express.Router();

router
    .get(Endpoints.queue, QueueService.findAll)
    .get(`${Endpoints.queue}/:storeCode`, QueueService.generate)
    .delete(`${Endpoints.queue}/:storeCode`, QueueService.delete)

export default router;