import express from "express";
import cors from "cors";
import 'dotenv/config';
import { corsConfigurations } from "./config/config.js";
import routes from './routes/routes.js';

const app = express();

app.use(cors(corsConfigurations));
app.use(express.json());
app.use('/', routes);

export default app;