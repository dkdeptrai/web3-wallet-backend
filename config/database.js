const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize("wallet", "root", "root", {
  host: "mysql",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

// Import models
const User = require("../models/User")(sequelize);
const PublicAddress = require("../models/PublicAddress")(sequelize);

require("../models/associations")({ User, PublicAddress });

module.exports = { sequelize, User, PublicAddress };
