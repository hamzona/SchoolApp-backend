require("dotenv").config();

const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");

const authJwt = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw Error("Must be authenticated");
    }
    const token = authorization.split(" ")[1];
    const { _id } = await jwt.verify(token, process.env.SECRET);
    const user = await Auth.findById({ _id });
    req.user = user._id;
    req.userName = user.name;
    req.jwt = token;
    next();
  } catch (e) {
    res.json({ error: e.message });
  }
};

module.exports = authJwt;
