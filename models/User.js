const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email must be unique",
      },
      allowNull: true,
    },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    publicAddress: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username must be unique",
      },
      allowNull: false,
      validate: {},
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username must be unique",
      },
      allowNull: false,
      validate: {},
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USER",
    },
  });

  return User;
};
