const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const PublicAddress = sequelize.define("PublicAddress", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    publicAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  return PublicAddress;
};
