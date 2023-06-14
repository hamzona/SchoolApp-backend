const route = require("express").Router();
const {
  uploadSingle,
  saveFileName,
  getImg,
  getImgs,
  deleteImg,
  uploadMultiple,

  saveMultipleFileNames,
  saveMultipleImagesNamesComment,
  deleteImgFromPostsAndComments,
} = require("../controllers/imgController");
const auth = require("../middleware/authJwtMiddleware");
route.post("/post/:name", auth, deleteImg, uploadSingle, saveFileName);
route.get("/getImg/:name", auth, getImg);
route.get("/getImgPublic/:name", getImg);

route.get("/deleteImg/:name", deleteImgFromPostsAndComments);
route.post(
  "/postMultiple/:postId",
  auth,
  uploadMultiple,
  saveMultipleFileNames,
  (req, res) => {
    res.json(req.files);
  }
);
route.post(
  "/postMultipleCommentImgs/:commentId",
  auth,
  uploadMultiple,
  saveMultipleImagesNamesComment,
  (req, res) => {
    res.json(req.files);
  }
);
module.exports = route;
