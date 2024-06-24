const { default: axios } = require("axios");
const cron = require("node-cron");
const { sequelize, DataTypes } = require("../config/database");
NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL;
const Article = require("../models/Article")(sequelize, DataTypes);

const fetchAndSaveNews = async () => {
  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}&language=en`);
    const articles = response.data.articles;

    const newsArticles = articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      author: article.author,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: new Date(article.publishedAt),
    }));
    await sequelize.transaction(async (transaction) => {
      for (const newsArticle of newsArticles) {
        await Article.findOrCreate({
          where: { url: newsArticle.url },
          defaults: newsArticle,
          transaction,
        });
      }
    });
    console.log("News fetched and saved successfully");
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("0 * * * *", fetchAndSaveNews);

module.exports = fetchAndSaveNews;
