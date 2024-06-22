const axios = require("axios");
const { Alchemy, Network, Wallet } = require("alchemy-sdk");
const ALCHEMY_API_URL = process.env.ALCHEMY_RPC_URL;
const { getSocketIoInstance } = require("../config/socket.config");

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  Network: Network.ETH_SEPOLIA,
};

const io = getSocketIoInstance();

io.use((socket, next) => {
  next();
});

const alchemy = new Alchemy(settings);

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

exports.sendRawTransaction = async (req, res) => {
  try {
    const rawTransaction = req.body.transactionHash;
    if (!rawTransaction || typeof rawTransaction !== "string") {
      return res.status(400).send({ message: "Invalid transaction hash" });
    }
    console.log("rawTransaction", rawTransaction);
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction",
      params: [rawTransaction],
      id: 1,
    });
    const sendTx = response.data.result;
    res.status(200).send({
      transactionHash: sendTx,
    });
    monitorTransactionStatus(sendTx);
  } catch (error) {
    console.error("Error sending raw transaction:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

function monitorTransactionStatus(transactionHash) {
  const emitTransactionStatus = (status) => {
    io.emit(transactionHash, status);
  };

  const interval = setInterval(async () => {
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [transactionHash],
      id: 1,
    });
    const receipt = response.data.result;

    console.log("Transaction receipt:", receipt);
    if (receipt && receipt.blockNumber) {
      console.log("Transaction mined on block:", receipt.blockNumber);
      emitTransactionStatus({
        status: "mined",
        blockNumber: receipt.blockNumber,
      });

      clearInterval(interval);
    } else {
      console.log("Transaction not mined yet");
      emitTransactionStatus({ status: "pending" });
    }
  }, 5000);
}
