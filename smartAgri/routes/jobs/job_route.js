const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  getMyJobs,
  deleteDBJob,
  getJobs,
} = require("../../controllers/jobs/job_controller");

router.post("/createJob", createJob);
router.get("/getAllJobs", getAllJobs);
router.get("/getMyJobs/:userId", getMyJobs);
router.post("/getJobs/:userId", getJobs);
router.delete("/deleteJob/:id", deleteJob);
router.put("/updateJob/:id", updateJob);
router.delete("/deleteDBJob/:id", deleteDBJob);
module.exports = router;
