const express = require("express");
const dotenv  = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js")
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3200;
const authRoute = require("./routes/authRoute.js");
const jobRoute = require("./routes/jobRoute.js");
const resumeRoute = require("./routes/resumeRoute.js")
const protect = require("./middleware/authMiddleware.js");


app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
 res.send("kuch bi");
}) 

//signup route api
app.use("/api/auth", authRoute);

//addjob route api
app.use("/api/jobs", jobRoute);

//resume upload function
app.use("/api/resume", resumeRoute);

//mongosedb connection
connectDB();

//protected route testing

app.get("/api/protected", protect, (req, res)=>{
    res.json({
        message: "You are accessing private routes",
        user: req.user
    })
})


app.listen(PORT);
