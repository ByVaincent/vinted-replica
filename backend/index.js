const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.json());

const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/vinted-replica");

//routes import
const userRoute = require("./routes/user");

app.get("/", (req, res) => {
  res.json("Hi!");
});

app.use(userRoute);

app.all("*", (req, res) => {
  res.status(404).json("Not found!");
});

app.listen(PORT, () => {
  console.log("server's runnin'");
});
