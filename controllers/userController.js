const { sequelize, DataTypes } = require("../config/database");
const User = require("../models/User")(sequelize, DataTypes);
const PublicAddress = require("../models/PublicAddress")(sequelize, DataTypes);
const Contact = require("../models/Contact")(sequelize, DataTypes);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const cloudinaryService = require("../services/cloudinaryService");
const { body, query, validationResult } = require("express-validator");
const { where } = require("sequelize");

const verifyToken = require("../middlewares/authMiddleware").verifyToken;

exports.signupValidators = [
  // body("username").exists().withMessage("Username is required"),
  // body("email").exists().withMessage("Email is required"),
  // body("password").exists().withMessage("Password is required"),
];
exports.signup = [
  ...exports.signupValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const user = await User.create({
        publicAddress: req.body.publicAddress,
        username: req.body.publicAddress,
      });
      res.status(201).send({ message: "User was registered successfully!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.signinValidators = [
  body("publicAddress").exists().withMessage("Public Address is required"),
];
exports.signin = [
  ...exports.signinValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({
        where: {
          publicAddress: req.body.publicAddress,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // const passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // );

      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: "Invalid Password!",
      //   });
      // }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.expiresIn,
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        accessToken: token,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.publicAddressValidators = [
  body("publicAddress").exists().withMessage("Public Address is required"),
  body("userId").exists().withMessage("User ID is required"),
];

exports.addPublicAddress = [
  ...exports.publicAddressValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      verifyToken(req, res, async () => {
        const user = await User.findOne({
          where: {
            id: req.userId,
          },
        });

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        const existingPublicAddress = await PublicAddress.findOne({
          where: {
            publicAddress: req.body.publicAddress,
            userId: req.userId,
          },
        });

        if (existingPublicAddress) {
          return res.status(400).send({
            message: "Identical public address for this user already exists!",
          });
        }

        await PublicAddress.create({
          publicAddress: req.body.publicAddress,
          userId: req.userId,
        });

        res.status(201).send({ message: "Public address added successfully!" });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.getPublicAddressesValidators = [
  query("userId").exists().withMessage("User ID is required"),
];

exports.getPublicAddress = [
  ...exports.getPublicAddressesValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      verifyToken(req, res, async () => {
        const userId = req.query.userId;
        const user = await User.findOne({
          where: {
            id: userId,
          },
        });

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        const publicAddress = await PublicAddress.findAll({
          where: {
            userId: userId,
          },
        });

        res.status(200).send(publicAddress);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.deletePublicAddressValidators = [
  query("publicAddressId")
    .exists()
    .withMessage("Public Address ID is required"),
  query("userId").exists().withMessage("User ID is required"),
];

exports.deletePublicAddress = [
  ...exports.deletePublicAddressValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      verifyToken(req, res, async () => {
        const publicAddress = await PublicAddress.findOne({
          where: {
            id: req.query.publicAddressId,
          },
        });
        if (!publicAddress) {
          return res.status(404).send({ message: "Public Address Not found." });
        }
        const currentUser = await User.findOne({
          where: {
            id: req.query.userId,
          },
        });
        if (
          (currentUser.id !== publicAddress.userId &&
            currentUser.role !== "ADMIN") ||
          !publicAddress.userId
        ) {
          return res.status(403).send({
            message: "You are not authorized to delete this public address!",
          });
        }

        await publicAddress.destroy();
        res
          .status(200)
          .send({ message: "Public Address deleted successfully!" });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.addAvatarValidators = [
  body("userId").exists().withMessage("User ID is required"),
  body("avatar").exists().withMessage("Avatar is required"),
];

exports.addAvatar = [
  ...exports.addAvatarValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      if (!req.file) {
        return res.status(400).send({ message: "Please upload an image!" });
      }
      console.log(req.file);
      const result = await cloudinaryService.uploadImage(req.file.path);
      const user = await User.findOne({
        where: {
          id: req.body.userId,
        },
      });
      user.avatarUrl = result;
      await user.save();
      res.json({ avatarUrl: result });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  },
];

exports.updateProfile = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const user = await User.findOne({
        where: {
          id: req.body.userId,
        },
      });
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.username = req.body.username;
      const result = await cloudinaryService.uploadImage(req.file.path);
      user.avatarUrl = result;
      user.save();
      res.json({
        userId: req.body.userId,
        username: req.body.username,
        avatarUrl: result,
      });
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

exports.getProfile = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const user = await User.findOne({
        where: {
          id: req.query.userId,
        },
      });
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const userInfo = {
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        publicAddress: user.publicAddress,
      };
      res.status(200).send(user);
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

exports.addContact = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const contact = await Contact.create({
        name: req.body.name,
        publicAddress: req.body.publicAddress,
        userId: req.body.userId,
      });
      res.status(201).send({ message: "Contact added successfully!" });
    });
  } catch (error) {
    console.error("Error adding contacts:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

exports.getContacts = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const contacts = await Contact.findAll({
        where: {
          userId: req.query.userId,
        },
        order: [["name", "ASC"]],
      });
      res.status(200).send(contacts);
    });
  } catch (error) {
    console.error("Error getting contacts:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};

exports.deleteContact = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const contact = await Contact.findOne({
        where: {
          id: req.query.contactId,
        },
      });
      if (!contact) {
        return res.status(404).send({ message: "Contact Not found." });
      }
      await contact.destroy();
      res.status(200).send({ message: "Contact deleted successfully!" });
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).send({ message: error.message });
    throw error;
  }
};
