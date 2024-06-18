const axios = require("axios");
const ALCHEMY_API_URL = process.env.ALCHEMY_RPC_URL;

exports.makeJsonRpcCall = async (req, res) => {
  try {
    const method = req.body.method;
    const params = req.body.params;
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      method,
      params,
      id: 1,
    });
    res.status(200).send({
      result: response.data.result,
    });
  } catch (error) {
    console.error("Error making JSON-RPC API call:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

exports.getEthBalance = async (req, res) => {
  try {
    const address = req.body.address;
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1,
    });
    res.status(200).send({
      balance: response.data.result,
    });
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};
