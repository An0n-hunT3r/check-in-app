import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { router as checkinRouter } from "./routers/checkins";
import { router as responseRouter } from "./routers/responses";
import { router as reportRouter } from "./routers/reports";
import { logger } from "./utils/logger";

dotenv.config();
const app = express();

const allowedOrigins = config.corsOrigins;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/checkins", checkinRouter);
app.use("/responses", responseRouter);
app.use("/reports", reportRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info("Server started", { port: config.port });
});

