import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import reportRoutes from "./routes/report.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_PREVIEW_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;