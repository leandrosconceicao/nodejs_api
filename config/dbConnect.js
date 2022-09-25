import mongoose from "mongoose";
import url from './db.js';

mongoose.connect(url)

let db = mongoose.connection;

export default db;