const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const https = require("https");
const fs = require("fs");
const { sequelize } = require("./config/database");
const { initSocket } = require("./config/socket.config");
const fetchAndSaveNews = require("./helpers/fetchNews");

dotenv.config();

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

const app = express();
const server = https.createServer(options, app);
// const server = http.createServer(app);

initSocket(server);

const Port = process.env.PORT || 3000;
fetchAndSaveNews();

const userRoutes = require("./routes/userRoutes");
const alchemyRoutes = require("./routes/alchemyRoutes");
const socketRoutes = require("./routes/socketRoutes");
const contractAbiRoutes = require("./routes/contractAbiRoutes");
const newsRoutes = require("./routes/newsRoutes");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/users", userRoutes);
app.use("/api/web3-helper", alchemyRoutes);
app.use("/api/socket.io", socketRoutes);
app.use("/api/contract-abi", contractAbiRoutes);
app.use("/api/news", newsRoutes);

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
