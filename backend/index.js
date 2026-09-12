require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDatabase = require("./config/database");
const routers = require("./routers/index.route");

const port = process.env.PORT || 5555;
const app = express();
const server = http.createServer(app);

connectDatabase();

const allowedOrigins = [
  "http://localhost:5173",
  "https://volunteer-hub-seven.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));
routers(app);

// ===== SOCKET.IO =====
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://volunteer-hub-seven.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

global._io = io;

// Lưu danh sách userId → socketId
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // client gửi userId khi kết nối
  socket.on("register", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
  });

  // khi user ngắt kết nối
  socket.on("disconnect", () => {
    for (let [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("❌ Client disconnected:", socket.id);
  });
});

global.sendToUser = (userId, event, data) => {
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`📩 Đã gửi ${event} đến user ${userId} (socket ${socketId})`);
  } else {
    console.log(`⚠️ Không tìm thấy socketId cho user ${userId}`);
  }
};

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
