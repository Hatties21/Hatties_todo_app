import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import authRouters from "./routes/authRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// CORS
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true, // bật nếu bạn dùng cookie
  })
);

// Cho phép preflight mọi đường dẫn (phòng hờ)
app.options("*", cors());

// Body parser
app.use(express.json());

// ===== ROUTES =====
app.use("/api/auth", authRouters);
app.use("/api/tasks", taskRoute);

// ===== STATIC (PROD) =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
    console.log(`CORS origin: ${ORIGIN}`);
  });
});
