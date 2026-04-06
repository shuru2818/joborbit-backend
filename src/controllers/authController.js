const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendWelcomeEmail, sendOTPEmail} =require("../services/emailService.js");
const generateOTP = require("../utils/generateOTP.js")


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5*60*1000,
      isVerified: false
    });

    sendOTPEmail(email, otp);
    res.status(201).json({ message: "OTP SENT", email: newUser.email });

    // await sendWelcomeEmail(email, password);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "OTP invalid" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      ProfilePic: user.ProfilePic,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//forgotpassword logic

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    sendOTPEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


//reset password logic

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


//resend otp logic

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    sendOTPEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully", email });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};



//loginuser

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({ message: "Account not verified. Please verify OTP first." });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      ProfilePic: existingUser.ProfilePic,
      token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


//userprofile

exports.getUserProfile = async(req, res)=>{
  try{
    const user = await User.findById(req.user._id).select("-password");

    if(!user){
      return res.status(401).json({ message: "User not found" });  
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneno: user.phoneno,
      bio: user.bio,
      location: user.location,
      ProfilePic: user.ProfilePic,
      skills: user.skills
    })
  }catch(err){
    res.status(500).json({ message: "Server Error" });
  }
}

//update profile

exports.updateProfile = async(req, res)=>{
  try{
    const { username, phoneno, bio, location, skills } = req.body;

    const user = await User.findById(req.user._id);

    if(!user){
      return res.status(401).json({ message: "User not found" });  
    }

    // Update fields if provided
    if(username && username.trim()) user.username = username.trim();
    if(phoneno !== undefined && phoneno !== null) user.phoneno = phoneno;
    if(bio !== undefined && bio !== null) user.bio = bio;
    if(location !== undefined && location !== null) user.location = location;
    
    // Handle skills - it comes as JSON string from FormData
    if(skills) {
      try {
        const parsedSkills = JSON.parse(skills);
        if(Array.isArray(parsedSkills)) {
          user.skills = parsedSkills;
        }
      } catch (parseErr) {
        // If parsing fails, don't update skills
      }
    }

    // Handle profile picture upload
    if(req.file){
      user.ProfilePic = req.file.path; // Cloudinary URL
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneno: user.phoneno,
      bio: user.bio,
      location: user.location,
      ProfilePic: user.ProfilePic,
      skills: user.skills
    })
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}

