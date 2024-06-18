const { sequelize, DataTypes } = require("../config/database");
const User = require("../models/User")(sequelize, DataTypes);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { where } = require("sequelize");
const cloudinaryService = require("../services/cloudinaryService");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.addPublicKey = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const existingPublicKey = await PublicAddress.findOne({
      where: {
        publicKey: req.body.publicKey,
        userId: req.userId,
      },
    });

    if (existingPublicKey) {
      return res
        .status(400)
        .send({ message: "Public key for this user already exists!" });
    }

    await PublicAddress.create({
      publicKey: req.body.publicKey,
      userId: req.userId,
    });

    res.status(201).send({ message: "Public key added successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.addAvatar = async (req, res) => {
  try {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.hostname}`
    );
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.hostname}`
    );
    console.log("Headers:", req.headers);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
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
};
