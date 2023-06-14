const Post = require("../models/postModel");
const User = require("../models/authModel");
const filterPosts = async (req, res, next) => {
  /*sortiranje */
  const { sortBy } = req.query;

  let sortOpition = {};
  if (sortBy === "likes") {
    sortOpition = { likes: -1 };
  } else if (sortBy === "date") {
    sortOpition = { date: -1 };
  }
  /*FILTERS */

  //price
  const search = req.query.search || "";
  let max = parseFloat(req.query.max);
  let min = parseFloat(req.query.min);
  let setPrice = false;
  if (!(!max && !min)) {
    setPrice = true;
  }
  if (!max) {
    max = 10000;
  }
  if (!min) {
    min = 0;
  }
  let priceFilter = setPrice
    ? {
        $and: [
          { price: { $exists: true, $ne: null } },
          { $or: [{ price: null }, { price: { $gt: min, $lt: max } }] },
        ],
      }
    : {};
  let filters = {};
  Object.keys(req.query).forEach((item) => {
    if (item === "subject" || item === "dataType") {
      filters[item] = req.query[item];
    }
  });
  const posts = await Post.find({
    $and: [
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { userName: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
        ],
      },
      filters,
      priceFilter,
    ],
  }).sort(sortOpition);
  req.data = await Promise.all(
    posts.map(async (post) => {
      const userData = await User.findById(post.userId, {
        _id: 0,
        password: 0,
      });
      if (!userData) return post;
      const postWuser = { ...post._doc, ...userData._doc };
      return postWuser;
    })
  );
  // req.data = dataWithUser.filter((item) => {
  //   if (!user) {
  //     return item;
  //   } else if (item.name === user) {
  //     return item;
  //   }
  // });

  next();
};

module.exports = { filterPosts };
