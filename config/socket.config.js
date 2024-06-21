const socketIo = require("socket.io");
let io;

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    socket.on("message", (message) => {
      console.log("Received message:", message);
      io.emit("message", message);
    });
  });
}

function getSocketIoInstance() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}

module.exports = {
  initSocket,
  getSocketIoInstance,
};
