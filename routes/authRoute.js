const express = require("express");
const route = express.Router();
const { singup, login, getUser } = require("../controllers/authController");
//singup
route.get("/singup", (req, res) => {
  res.send("/singup");
});
route.post("/singup", singup);
//login
route.post("/login", login);

//get user
route.get("/getUsr/:name", getUser);
module.exports = route;
