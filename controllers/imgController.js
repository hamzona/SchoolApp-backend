require("dotenv").config();

const User = require("../models/authModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const multer = require("multer");
const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const GridFSBucket = require("mongodb").GridFSBucket;
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  // options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/webp"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "uploadsImages",
      filename: `${Date.now()}${path.extname(file.originalname)}`,
    };
  },
});

const uploadSingle = multer({ storage }).single("img");
const uploadMultiple = multer({ storage }).array("imgs");

const saveFileName = async (req, res) => {
  if (!req.file.filename) {
    const user = await User.findById({ _id: req.user });
    return res.json(user);
  }
  try {
    let updateUser = await User.findByIdAndUpdate(
      { _id: req.user },
      { $set: { imgName: req.file.filename } },
      { returnOriginal: false }
    );
    const token = { token: req.jwt };
    updateUser = { ...updateUser._doc, ...token };
    res.json(updateUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const saveMultipleFileNames = async (req, res) => {
  const fileNames = req.files.map((file) => {
    return file.filename;
  });
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: req.params.postId },
      {
        $set: {
          postImgs: fileNames,
        },
      },
      {
        returnOriginal: false,
      }
    );
    res.json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

/*Save img names in comment */
const saveMultipleImagesNamesComment = async (req, res) => {
  const fileNames = req.files.map((file) => {
    return file.filename;
  });
  try {
    let comment = await Comment.findByIdAndUpdate(
      { _id: req.params.commentId },
      {
        $set: {
          commentImgsNames: fileNames,
        },
      },
      {
        returnOriginal: false,
      }
    );
    const user = await User.findOne(
      { _id: comment.userId },
      { _id: 0, password: 0 }
    );
    comment = { ...comment._doc, ...user._doc };
    res.json(comment);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient(process.env.MONGO_URL);

const deleteImg = async (req, res, next) => {
  try {
    if (!req.params.name || req.params.name === "undefined") {
      return next();
    }
    await mongoClient.connect();
    const database = mongoClient.db("test");
    const bucket = new GridFSBucket(database, {
      bucketName: "uploadsImages",
    });

    const file = await database
      .collection("uploadsImages.files")
      .findOne({ filename: req.params.name });

    bucket.delete(file._id);
    // console.log(file);
    req.file = file;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
const deleteImgFromPostsAndComments = async (req, res, next) => {
  req.params.name;
  try {
    if (!req.params.name || req.params.name === "undefined") {
      return res.json({ p: "nesto ne valja" });
    }
    await mongoClient.connect();
    const database = mongoClient.db("test");
    const bucket = new GridFSBucket(database, {
      bucketName: "uploadsImages",
    });

    const file = await database
      .collection("uploadsImages.files")
      .findOne({ filename: req.params.name });

    bucket.delete(file._id);
    req.file = file;
    const js = JSON.stringify(file);
    res.json(file);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
const getImg = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db("test");
    const bucket = new GridFSBucket(database, {
      bucketName: "uploadsImages",
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
/*
const getImgs = async (req, res) => {
  const { names } = req.query;
  console.log(names);
  // names = Array.from(names);
  try {
    await mongoClient.connect();

    const database = mongoClient.db("test");
    const bucket = new GridFSBucket(database, {
      bucketName: "uploadsImages",
    });

    names.forEach((name) => {
      let downloadStream = bucket.openDownloadStreamByName(name);

      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });

      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });

      downloadStream.on("end", () => {
        return res.end();
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
*/
/*
const deleteAllCommentsImagesFormPost = async (req, res) => {
const postId=req.params
try{
  const comments=await Comment.find({postId:postId})

  const imgNames=comments.map(comment=>{
    return comment.im
  })
}catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }

};*/
module.exports = {
  uploadMultiple,
  uploadSingle,
  saveFileName,
  getImg,

  deleteImg,
  deleteImgFromPostsAndComments,
  saveMultipleFileNames,
  saveMultipleImagesNamesComment,
};
