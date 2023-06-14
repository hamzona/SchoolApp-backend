const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  content: { type: String },
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  rate: { type: Number },
  commentImgsNames: { type: Array, required: true },
});
const model = mongoose.model("Comments", Schema);

module.exports = model;
