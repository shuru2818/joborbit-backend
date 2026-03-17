const express = require("express");
const {addJob, getJob, updateJob, deleteJob, calculateScore} = require("../controllers/jobController.js");
const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

//new post add
router.post("/addjob", protect, addJob);

//get the jobs
router.get("/getjobs", protect, getJob );


//update the job
router.put("/:id/updatejob", protect, updateJob );

//delete a job
router.delete("/:id/deletejob", protect, deleteJob);

//match calculate
router.post("/:id/match", protect, calculateScore)

module.exports = router;

 