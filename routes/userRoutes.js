const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");

router.post("/register", userController.signup);
router.post("/login", userController.signin);
router.post("/public-address", userController.addPublicAddress);
router.get("/public-address", userController.getPublicAddress);
router.delete("/public-address", userController.deletePublicAddress);

router.post("/upload-avatar", upload.single("image"), userController.addAvatar);
router.post("/profile", userController.updateProfile);
router.get("/profile", userController.getProfile);
router.post("/contacts", userController.addContact);
router.get("/contacts", userController.getContacts);

module.exports = router;
