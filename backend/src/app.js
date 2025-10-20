import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "./v1/config/env.config.js";

import { authRoutes, userRoute } from "./v1/routes/index.js";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
// });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: createError.TooManyRequests().status,
    message: createError.TooManyRequests().message,
  },
});

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://mynet.tn",
    "https://mynet.tn",
    "https://www.mynet.tn",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
// Global variable appRoot with base dirname
global.appRoot = path.resolve(__dirname);

// Middlewares
app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const apiVersion = "v1";



// Routes
app.use(`/${apiVersion}/auth`, authRoutes);
app.use(`/${apiVersion}/user`, userRoute);


// // Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

// Server Configs
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 @ http://localhost:${PORT}`);
  console.log(`connected to ${process.env.DATABASE_URL}`);
});
