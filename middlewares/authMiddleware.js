const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  console.log(typeof authHeader);
  if (typeof authHeader !== "undefined") {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      const token = parts[1];
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
      });
    } else {
      return res.status(401).send({
        message: "No token provided or token doesn't start with Bearer",
      });
    }
  } else {
    return res.status(401).send({ message: "No token provided" });
  }
};
