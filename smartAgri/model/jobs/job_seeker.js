const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jobSeekerSchema = new mongoose.Schema(
  {
    appliedDate: {
      type: String,
      required: true,
    },
    distance: { type: Number, required: true },
    jobStatus: { type: Number, required: true, default: 1 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    seekerCancelReason: {
      type: String,
    },
    employeerCancelReason: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const jobseeker = mongoose.model("jobseeker", jobSeekerSchema);

module.exports = jobseeker;
