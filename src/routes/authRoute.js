const express = require("express");
const {registerUser, verifyOTP, loginUser, resendOTP, forgotPassword, resetPassword} = require("../controllers/authController.js");
const router = express.Router();

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.post("/verify", verifyOTP)
router.post("/resend", resendOTP)
router.post("/forgot", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router;