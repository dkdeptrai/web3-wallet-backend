const express = require("express");
const router = express.Router();

const contractAbiController = require("../controllers/contractAbiController");

router.get("/get-abi", contractAbiController.getContractAbi);

module.exports = router;
