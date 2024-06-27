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
const Article = require("../models/Article")(sequelize);
const Contact = require("../models/Contact")(sequelize);

require("../models/associations")({ User, PublicAddress, Contact });

module.exports = { sequelize, User, PublicAddress, Article };
