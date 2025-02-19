const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//signup route
router.post("/user/signup", userCtrl.signup);

//authentication route login
router.post("/user/login", userCtrl.login);
module.exports = router;
