const { default: axios } = require("axios");
const cron = require("node-cron");
const { sequelize, DataTypes } = require("../config/database");
NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL;
const Article = require("../models/Article")(sequelize, DataTypes);

exports.getNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pagesize) || 10;
    const offset = (page - 1) * pageSize;

    const { count, rows: articles } = await Article.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["publishedAt", "DESC"]],
    });
    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({ articles, totalArticles: count, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
