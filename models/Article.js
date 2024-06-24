const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Article = sequelize.define("Articles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return Article;
};
