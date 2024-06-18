const express = require("express");
const dotenv = require("dotenv");
const { sequelize } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const alchemyRoutes = require("./routes/alchemyRoutes");

dotenv.config();

const app = express();

const Port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/web3-helper", alchemyRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(Port, () => {
      console.log(`Server running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
