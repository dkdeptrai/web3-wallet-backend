// testAxiosRetry.js
const axios = require("axios");
const axiosRetry = require("axios-retry");

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.code === "ECONNABORTED" || error.response?.status === 420;
  },
});

axios
  .get("https://api.coindesk.com/v1/bpi/currentprice.json")
  .then((response) => {
    console.log("Response data:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
