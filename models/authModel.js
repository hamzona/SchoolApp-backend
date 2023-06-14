const mongoose = require("mongoose");

const Auth = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  imgName: String,
});

const model = mongoose.model("Auth", Auth);

module.exports = model;
