import * as dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import appWs from "./src/app-ws.js";
import {createServer} from 'http';

const httpServer = createServer(app);


const port = process.env.PORT || 80


httpServer.listen(port, "0.0.0.0")

appWs(httpServer);
// export default io;