const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

app.use(express.json());

const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/vinted-replica");

//routes import
const userRoute = require("./routes/user");
const offerRoute = require("./routes/offer");

//middlewares import
const isAuthenticatedMiddl = require("./middlewares/isAuthenticated");

// cloudinary configuration
cloudinary.config({
  cloud_name: "dnalkl1ul",
  api_key: "341782661484874",
  api_secret: "5Wiq2ruXxkXbOHNY4TIV9sZAwZA", // Click 'View API Keys' above to copy your API secret
});

app.get("/", (req, res) => {
  res.json("Hi!");
});

app.use(userRoute);

app.use(isAuthenticatedMiddl, offerRoute);

app.all("*", (req, res) => {
  res.status(404).json("Not found!");
});

app.listen(PORT, () => {
  console.log("server's runnin'");
});
