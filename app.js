import express from "express";
import bodyParser from "body-parser";
import api from "./routers/index.js";
import cors from "cors";
import { swaggerUi, specs } from "./swagger/swagger.js";
const app = express();
app.listen(18083);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", api);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
