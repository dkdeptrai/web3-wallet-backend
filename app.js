const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { sequelize } = require("./config/database");
const { initSocket } = require("./config/socket.config");

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

const Port = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const alchemyRoutes = require("./routes/alchemyRoutes");
const socketRoutes = require("./routes/socketRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/web3-helper", alchemyRoutes);
app.use("/socket.io", socketRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    server.listen(Port, () => {
      console.log(`Server running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
