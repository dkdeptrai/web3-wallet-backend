const express = require("express");
const router = express.Router();
const alchemyController = require("../controllers/alchemyController");

router.post("/make-json-rpc-call", alchemyController.makeJsonRpcCall);
router.post("/get-eth-balance", alchemyController.getEthBalance);
router.post("/send-raw-transaction", alchemyController.sendRawTransaction);
router.post(
  "/get-transaction-history",
  alchemyController.getTransactionHistory
);

module.exports = router;
