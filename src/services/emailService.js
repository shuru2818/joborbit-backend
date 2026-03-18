const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


const transporter = nodemailer.createTransport({
  service : "gmail",
  auth : {
    user: process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
})

async function sendWelcomeEmail(toEmail, username){
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Welcome 🎉",
      text: `Hello ${username}, welcome to our platform! 🚀`,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("❌ Email error:", error.message);
  }
};


async function sentOTPEmail(toEmail, otp){
  try{
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "OTP Verification",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>Valid for 5 minutes</p>
      `,
    })
    console.log("Otp Sent");
    
  }catch(err){
    console.log("❌ OTP error:", error.message);
  }
}

module.exports = {sendWelcomeEmail,sentOTPEmail};