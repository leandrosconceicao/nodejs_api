import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
const url = process.env.DB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url)


let db = mongoose.connection;

export default db;