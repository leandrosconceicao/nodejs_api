import admin from "firebase-admin";
import {createRequire} from "module";
import * as dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.FIREBASEDB;
const require = createRequire(import.meta.url);
const serviceAccount = require("../firebase_config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseUrl,
});

export default admin;
