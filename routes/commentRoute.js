const express = require("express");
const auth = require("../middleware/authJwtMiddleware");
const route = express();
const {
  postComment,
  getComments,
  deleteComment,
  deleteAllCommentsFromPost,
  getAllCommentImgNamesFromPost /*
  updatePost,
  updateUser,*/,
} = require("../controllers/commentController");
route.post("/add", auth, postComment /* updatePost, updateUser*/);
route.post("/all", getComments);
route.delete("/delete", deleteComment);
route.get(
  "/deleteAllCommentsFromPost/:postId",
  deleteAllCommentsFromPost,
  (res, req) => {
    res.json(req.deletedFile);
  }
);
route.get(
  "/getAllCommentImgNamesFromPost/:postId",
  getAllCommentImgNamesFromPost
);
module.exports = route;
