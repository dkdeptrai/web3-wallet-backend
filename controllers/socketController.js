// controllers/socketController.js
const axios = require("axios");

const LIVE_COIN_WATCH_API = process.env.LIVE_COIN_WATCH_API;

let intervals = {};

exports.startCoinsPricePolling = (socket) => {
  console.log("Polling started");

  const pollPrices = async (retryCount = 3) => {
    try {
      console.log("start polling");
      const url = "https://api.livecoinwatch.com/coins/list";
      const data = {
        currency: "USD",
        sort: "rank",
        order: "ascending",
        offset: 0,
        limit: 10,
        meta: true,
      };
      const headers = {
        "content-type": "application/json",
        "x-api-key": LIVE_COIN_WATCH_API,
      };
      const response = await axios.post(url, data, { headers });
      socket.emit("newPrice", response.data);
      // socket.emit("hello", { message: "Hello from the server" });
    } catch (err) {
      console.error("Error polling API:", err.message);
      socket.emit("error", err.message);

      if (
        retryCount > 0 &&
        (err.code === "ECONNABORTED" || err.response?.status === 420)
      ) {
        console.log(`Retrying... attempts left: ${retryCount}`);
        setTimeout(
          () => pollPrices(retryCount - 1),
          Math.pow(2, 3 - retryCount) * 1000
        );
      }
    }
  };

  const intervalId = setInterval(pollPrices, 10000);
  intervals[socket.id] = intervalId;

  socket.on("disconnect", () => {
    console.log("Client disconnected, stopping polling");
    clearInterval(intervals[socket.id]);
    delete intervals[socket.id];
  });
};

exports.stopCoinsPricePolling = (socket) => {
  console.log("Polling stopped");
  clearInterval(intervals[socket.id]);
  delete intervals[socket.id];
};

exports.addWebhookAddress = async (newAddress) => {
  const body = {
    webhook_id: "wh_0oftcre8sshlxj27",
    address_to_add: [newAddress],
    addresses_to_remove: [],
  };

  try {
    const response = await axios.post("http");
  } catch (err) {}
};
