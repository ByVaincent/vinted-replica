const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//signup route
router.post("/user/signup", userCtrl.signup);

//authentication route login
router.post("/user/login", async (req, res) => {
  try {
    //check the incoming datas
    if (!req.body.email || !req.body.password) {
      throw { status: 400, message: "Please, add an email and a password" };
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw { status: 400, message: "Invalid email or password" };
    }

    //check if the password is good
    const authorized = decryptingFunction(
      req.body.password,
      user.salt,
      user.hash
    );

    if (!authorized) {
      throw { status: 401, message: "Invalid email or password" };
    }

    res.json({
      _id: user._id,
      token: user.token,
      account: {
        username: user.account.username,
      },
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Internal server error");
  }
});
module.exports = router;
