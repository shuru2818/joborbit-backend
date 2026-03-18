const express = require("express");
const {registerUser, verifyOTP, loginUser, resendOTP} = require("../controllers/authController.js");
const router = express.Router();

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.post("/verify", verifyOTP)
router.post("/resend", resendOTP)


module.exports = router;