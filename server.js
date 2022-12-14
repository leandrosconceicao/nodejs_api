import * as dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import {createServer} from 'http';
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {})

const port = process.env.PORT || 80


httpServer.listen(port, "0.0.0.0")

export default io;