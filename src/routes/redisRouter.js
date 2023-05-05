import express from "express";
import RedisController from "../controllers/redis/redisController.js";
import Endpoints from "../models/Endpoints.js";

const router = express.Router();

router
    .get(Endpoints.redis, RedisController.findOne)
    .post(Endpoints.redis, RedisController.post)

export default router;