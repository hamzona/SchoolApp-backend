require("dotenv").config();

const User = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

function createToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET);
}
const singup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    //validation
    if (!email || !password || !name) {
      throw Error("All field must be fullfield");
    }

    const exsistEmail = await User.findOne({ email });
    if (exsistEmail !== null) {
      throw Error("email alredy exsist");
    }
    const exsistName = await User.findOne({ name: name });
    if (exsistName !== null) {
      throw Error("name already exsist");
    }

    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      password: hash,
      name: name,
    });
    const token = await createToken(newUser._id);

    res.json({ email, token, name });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("All field must be fullfield");
    }
    const LoginUser = await User.findOne({ email });

    if (LoginUser === null) {
      throw Error("User doesnt exsist");
    }
    if (!(await bcrypt.compare(password, LoginUser.password))) {
      throw Error("Password incorrect");
    }

    const token = await createToken(LoginUser._id);

    res.json({ email: LoginUser.email, name: LoginUser.name, token: token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { name: req.params.name },
      { _id: 0, password: 0 }
    );
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
module.exports = { singup, login, getUser };
