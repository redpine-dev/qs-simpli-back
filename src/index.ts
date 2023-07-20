import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./db";
import router from "./routes/appRouter";

// import { update2WeeksSales } from "./scheduledFunctions/update2WeekSales";

dotenv.config({
  path: __dirname + "/.env",
});

const PORT = process.env.PORT || 5000;

//iniciar express
const app = express();
app.use(cors()); // middleware para

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api", router());

// llamamos al cron
//escuchar el puerto
app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Listening on port ${PORT}`);
});
