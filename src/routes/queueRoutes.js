import express from 'express';
import QueueService from '../controllers/queue/QueueController.js';
import Endpoints from '../models/endpoints.js';

const router = express.Router();

router
    .get(Endpoints.queue, QueueService.findAll)
    .post(Endpoints.queue, QueueService.add)

export default router;