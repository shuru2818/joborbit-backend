const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const { cloudinaryUpload } = require("../middleware/uploadMiddleware.js");
const {registerUser, verifyOTP, loginUser, resendOTP, forgotPassword, resetPassword, getUserProfile, updateProfile} = require("../controllers/authController.js");
const router = express.Router();

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.post("/verify", verifyOTP)
router.post("/resend", resendOTP)
router.post("/forgot", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, cloudinaryUpload.single("profilePic"),updateProfile)

module.exports = router;