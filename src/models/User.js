const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,

        },
        otp : String,
        otpExpiry: Date,
        isVerified:{
            type:Boolean,
            default : false
        },
        phoneno:String,
        bio:String,
        location: String,
        ProfilePic:String,
        skills: [String]
},
    {timestamps:true}
)

module.exports = mongoose.model("User", userSchema);