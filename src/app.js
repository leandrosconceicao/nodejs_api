import express from "express";
import cors from "cors";
import router from './routes/index.js';
import url from "../config/dbConnect.js";

url.on("error", console.log.bind(console, 'Erro de conexão'))
url.once("open", () => console.log('Conexão com o banco feita com sucesso.'))
const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());


router(app);

export default app;