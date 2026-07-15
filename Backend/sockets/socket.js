import { Server } from "socket.io";
import User from "../models/user.js";

let io;

const normalizeRole = (role) =>
  typeof role === "string"
    ? role.trim().toLowerCase()
    : "";

export const connectSocket = (server, options = {}) => {
  io = new Server(server, {
    cors: {
      origin: options.corsOrigin || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  if (options.sessionMiddleware) {
    io.use((socket, next) =>
      options.sessionMiddleware(socket.request, {}, next)
    );
  }

  io.on("connection", (socket) => {
    socket.on("joinAdmin", async () => {
      const sessionUser =
        socket.request.session?.passport?.user;

      if (!sessionUser) {
        socket.emit("adminAccessDenied");
        return;
      }

      const user = await User.findOne({
        username: sessionUser,
      }).select("role status");

      if (
        !user ||
        normalizeRole(user.role) !== "admin" ||
        normalizeRole(user.status) !== "active"
      ) {
        socket.emit("adminAccessDenied");
        return;
      }

      socket.join("admins");
      console.log("Admin Joined Room");
    });
  });

  console.log("Socket Initialized");
};

export const getIO = () => {
  return io;
};
