const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const ALCHEMY_API_URL = process.env.ALCHEMY_RPC_URL;

async function makeJsonRpcCall(method, params) {
  try {
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      method,
      params,
      id: 1,
    });
    return response.data;
  } catch (error) {
    console.error("Error making JSON-RPC API call:", error);
    throw error;
  }
}

async function getEthBalance(address) {
  try {
    const result = await makeJsonRpcCall("eth_getBalance", [address, "latest"]);
    return result;
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

async function sendRawTransaction(transaction) {
  try {
    const result = await makeJsonRpcCall("eth_sendRawTransaction", [
      transaction,
    ]);
  } catch (error) {
    console.error("Error sending raw transaction:", error);
    throw error;
  }
}

module.exports = { getEthBalance, makeJsonRpcCall };
