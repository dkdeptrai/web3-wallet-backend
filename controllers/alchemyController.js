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

exports.getTransactionHistory = async (req, res) => {
  try {
    const address = req.body.address;
    const contractAddress = req.body.contractAddress;
    const page = req.body.page || 1;
    const pageSize = req.body.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const response_from = await axios.post(ALCHEMY_API_URL, {
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          withMetadata: true,
          excludeZeroValue: false,
          contractAddresses: contractAddress,
          category: [
            "external",
            "internal",
            "erc20",
            "erc721",
            "erc1155",
            "specialnft",
          ],
        },
      ],
    });

    const response_to = await axios.post(ALCHEMY_API_URL, {
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: address,
          withMetadata: true,
          excludeZeroValue: false,
          contractAddresses: contractAddress,
          category: [
            "external",
            "internal",
            "erc20",
            "erc721",
            "erc1155",
            "specialnft",
          ],
        },
      ],
    });
    const outgoingTransactions = response_from.data.result.transfers;
    const incomingTransactions = response_to.data.result.transfers;

    let allTransactions = [...outgoingTransactions, ...incomingTransactions];
    allTransactions.sort(
      (a, b) =>
        new Date(b.metadata.blockTimestamp) -
        new Date(a.metadata.blockTimestamp)
    );

    const totalTransactions = allTransactions.length;
    const totalPages = Math.ceil(totalTransactions / pageSize);
    const paginatedTransactions = allTransactions.slice(
      offset,
      offset + pageSize
    );

    res.status(200).send({
      transactions: paginatedTransactions,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting transaction history:", error);
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
