const jobSeeker = require("../../model/jobs/job_seeker");
const mongoose = require("mongoose");
//0-Applied 1-confirmed 2-cancelled 3-Rejected
async function applyJob(req, res) {
  console.log(req.body);
  try {
    const newData = new jobSeeker({
      ...req.body,
    });

    const result = await newData.save();
    console.log(result);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function employeerCancelJob(req, res) {
  try {
    const id = req.params.seekerId;
    const result = await jobSeeker.findByIdAndUpdate(
      id,
      {
        $set: {
          employeerCancelReason: req.body.reason,
          jobStatus: req.body.jobStatus,
        },
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function seekerCancelJob(req, res) {
  console.log(req.body);
  console.log(req.params.seekerId);
  try {
    const id = req.params.seekerId;
    const result = await jobSeeker.findByIdAndUpdate(
      id,
      {
        $set: {
          seekerCancelReason: req.body.reason,
          jobStatus: req.body.jobStatus,
        },
      },
      { new: true }
    );
    console.log(result);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function updateJob(req, res) {
  try {
    console.log(req.params.seekerId);
    const id = req.params.seekerId;
    const result = await jobSeeker.findByIdAndUpdate(
      id,
      {
        $set: { jobStatus: req.body.jobStatus },
      },
      { new: true }
    );
    console.log(result);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
async function getSeekers(req, res) {
  try {
    const result = await jobSeeker.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $addFields: { seeker: { $first: "$result" } },
      },
      {
        $project: {
          result: 0,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}

module.exports = {
  applyJob,
  employeerCancelJob,
  seekerCancelJob,
  updateJob,
  getSeekers,
};
