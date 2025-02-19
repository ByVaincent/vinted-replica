const User = require("../models/User");
const uid2 = require("uid2");

const encryptingFunction = require("../functions/functions").encryptingFunction;

const signup = async (req, res) => {
  try {
    //check the incoming datas
    if (!req.body.email) {
      throw { status: 400, message: "Please add a valid email" };
    } else if (!req.body.username) {
      throw { status: 400, message: "Please add a username" };
    } else if (!req.body.password || req.body.password.length < 5) {
      throw {
        status: 400,
        message: "Please add a valid password (> 4 characters",
      };
    }

    //check if the mail is already used
    if (await User.findOne({ email: req.body.email })) {
      throw { status: 409, message: "This email is already used" };
    }

    //encrypt the incoming password
    const newPassword = await encryptingFunction(req.body.password);

    //generate the token
    const newToken = await uid2(64);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      newsletter: req.body.newsletter,
      token: newToken,
      hash: newPassword.hash,
      salt: newPassword.salt,
    });

    await newUser.save();

    res.status(201).json({
      message: "User succesfully created",
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(error.message || "Internal server error");
  }
};

module.exports = { signup };
