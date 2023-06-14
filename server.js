require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const postsRoute = require("./routes/postsRoute");
const authRoute = require("./routes/authRoute");
const commentRoute = require("./routes/commentRoute");
const imgRoute = require("./routes/imgRoute");
app.use("/api/posts", postsRoute);
app.use("/api/users", authRoute);
app.use("/api/comments", commentRoute);
app.use("/api/img", imgRoute);
app.get("/hello", (req, res) => {
  res.send("hello");
});
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log(process.env.PORT);
    })
  );
mongoose.connection.on("open", () => {
  console.log("Connected");
});
