const express = require("express");
const route = express.Router();
const {
  addPost,
  deletePost,
  updatePost,
  getProfilPosts,
  likePost,
} = require("../controllers/postController");

//middleware
const authJwt = require("../middleware/authJwtMiddleware");
const { pagination } = require("../middleware/pagination");
const { filterPosts } = require("../middleware/filterPosts");
//get all
route.get("/allPosts", filterPosts, pagination);

//get allMyPosts
route.get("/allMy", getProfilPosts);

// add
route.post("/add", authJwt, addPost);
//like
route.post("/like/:postId", authJwt, likePost);
//delete
route.post("/delete", authJwt, deletePost);

//update
route.patch("/update", authJwt, updatePost);

module.exports = route;
