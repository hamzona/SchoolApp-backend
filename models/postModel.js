const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  userName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: null },
  subject: { type: String },
  dataType: { type: String },
  userId: { type: String, required: true },
  likes: { type: Array, required: true },
  date: { type: Date, required: true },
  userImg: { type: String },
  postImgs: { type: Array },
});

const model = mongoose.model("posts", Post);

module.exports = model;
