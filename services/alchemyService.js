const axios = require("axios");
const dotenv = require("dotenv");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

class AlchemyService {
  constructor() {
    dotenv.config();
    this.web3 = createAlchemyWeb3(process.env.ALCHEMY_RPC_URL);
  }

  async makeJsonRpcCall(method, params) {
    try {
      const response = await axios.post(this.web3._alchemyRpcUrl, {
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

  async getBalance(address) {
    try {
      const result = await this.makeJsonRpcCall("eth_getBalance", [
        address,
        "latest",
      ]);
      return result;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async sendRawTransaction(transaction) {
    try {
      const result = await this.makeJsonRpcCall("eth_sendRawTransaction", [
        transaction,
      ]);
      return result;
    } catch (error) {
      console.error("Error sending raw transaction:", error);
      throw error;
    }
  }
}

module.exports = AlchemyService;
