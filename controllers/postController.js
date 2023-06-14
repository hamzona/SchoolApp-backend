const Post = require("../models/postModel");
const User = require("../models/authModel");
const addPost = async (req, res) => {
  const { title, price, description, subject, dataType } = req.body;
  try {
    if (!title) {
      throw Error("Title is required");
    }
    const newPost = await Post.create({
      userName: req.userName,
      title: title,
      description: description,
      price: price,
      subject: subject,
      dataType: dataType,
      userId: req.user,
      likes: [],
      date: new Date(),
    });

    res.json(newPost);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postIF = await Post.findById(req.params.postId).select({
      likes: 1,
      _id: 0,
    });
    if (postIF.likes.includes(req.userName)) {
      const post = await Post.findByIdAndUpdate(
        { _id: req.params.postId },
        { $pull: { likes: req.userName } },
        { returnOriginal: false }
      );

      return res.json(post);
    }

    const post = await Post.findByIdAndUpdate(
      { _id: req.params.postId },
      { $push: { likes: req.userName } },
      { returnOriginal: false }
    );

    res.json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getProfilPosts = async (req, res) => {
  try {
    if (!req.query.user) {
      return res.json(null);
    }
    const posts = await Post.find();

    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const userData = await User.findById(post.userId, {
          _id: 0,
          password: 0,
        });
        const postWuser = { ...post._doc, ...userData._doc };
        return postWuser;
      })
    );

    const filterPosts = postsWithUsers.filter(
      (post) => post.name === req.query.user
    );
    res.json(filterPosts);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const deletePost = async (req, res) => {
  const { _id } = req.body;
  try {
    const deletePost = await Post.findOne({ _id });
    await deletePost.remove();
    res.json(deletePost);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
const updatePost = async (req, res) => {
  const { _id, title } = req.body;

  try {
    const updatePost = await Post.findOne({ _id });
    updatePost.title = title;
    await updatePost.save();
    res.json(updatePost);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
module.exports = {
  addPost,
  deletePost,
  updatePost,
  getProfilPosts,
  likePost,
};
