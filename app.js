import express from "express";
import bodyParser from "body-parser";
import api from "./routers/index.js";
import cors from "cors";
import { swaggerUi, specs } from "./swagger/swagger.js";
import { Client, GatewayIntentBits } from "discord.js";
import postWeekRank from "./cronjob/postWeekRank.js";
const app = express();
app.listen(18083);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//discord code
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
client.on("ready", () => {
  console.log("Ready!");
});
postWeekRank(client);
client.login(process.env.BOT_TOKEN);
