const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Contact = sequelize.define("Contact", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  return Contact;
};
