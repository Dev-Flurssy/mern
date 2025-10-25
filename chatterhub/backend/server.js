import dotenv from "dotenv";
dotenv.config();

import config from "./config/config.js";
import app from "./express.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

const PORT = config.port || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

mongoose
  .connect(config.mongoUri, {
    autoIndex: true,
  })
  .then(() => console.log("✅ Database Connection Successful"))
  .catch((err) => {
    console.error("❌ Database Connection Unsuccessful:", err.message);
    process.exit(1);
  });

mongoose.connection.on("connected", () => console.log("📡 MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("⚠️ MongoDB error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.log("🔌 MongoDB disconnected")
);

process.on("SIGIN", async () => {
  await mongoose.connection.close();
  console.log("🛑 Database disconnected through app termination");
  process.exit(0);
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("💬 Message received:", message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❎ User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 ChatterHub running at http://localhost:${PORT}`);
});
