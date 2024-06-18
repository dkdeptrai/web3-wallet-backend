const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");
console.log(upload);

router.post("/register", userController.signup);
router.post("/login", userController.signin);
router.post("/add-public-key", userController.addPublicKey);
router.post("/upload-avatar", upload.single("image"), userController.addAvatar);

module.exports = router;
