const express = require("express");
const router = express.Router();
const {
  applyJob,
  employeerCancelJob,
  seekerCancelJob,
  updateJob,
  getSeekers,
} = require("../../controllers/jobs/job_seeker_controller");

router.post("/applyJob", applyJob);
router.get("/getSeekers", getSeekers);
router.put("/employeerCancelJob/:seekerId", employeerCancelJob);
router.put("/seekerCancelJob/:seekerId", seekerCancelJob);
router.put("/updateJob/:seekerId", updateJob);

module.exports = router;
