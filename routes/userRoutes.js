const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.signup);
router.post("/login", userController.signin);
router.post("/add-public-key", userController.addPublicKey);

module.exports = router;
