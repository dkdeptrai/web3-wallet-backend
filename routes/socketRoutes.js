const express = require("express");
const router = express.Router();
const { getSocketIoInstance } = require("../config/socket.config");
const socketController = require("../controllers/socketController");

const io = getSocketIoInstance();

io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  socket.on("startCoinsPricePolling", () => {
    socketController.startCoinsPricePolling(socket);
  });
  socket.on("stopCoinsPricePolling", () => {
    socketController.stopCoinsPricePolling(socket);
  });
});

module.exports = router;
