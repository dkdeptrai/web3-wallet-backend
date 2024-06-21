const express = require("express");
const router = express.Router();
const { getSocketIoInstance } = require("../config/socket.config");
const socketController = require("../controllers/socketController");

const io = getSocketIoInstance();

io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  socket.on("startPolling", () => {
    socketController.startPolling(socket);
  });
  socket.on("stopPolling", () => {
    socketController.stopPolling(socket);
  });
});

module.exports = router;
