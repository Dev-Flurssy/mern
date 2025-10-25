import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

// 🧱 Security + optimization middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 🧾 Logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 🌍 CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// 📁 Static uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ✅ Main API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// 🏗 Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// ❌ Handle 404 API errors
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// 🚨 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
