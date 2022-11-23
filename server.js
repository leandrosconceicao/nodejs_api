import * as dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import {createServer} from 'http';
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, {})

io.on('connection', socket => {
    console.log('Socket conectado', socket.id);
    socket.on("sendMessage", data => {
        console.log(data);
    });
    socket.on("disconnect", (reason) => {
        console.log(reason);
    })
})


const port = process.env.PORT || 8081


httpServer.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`))