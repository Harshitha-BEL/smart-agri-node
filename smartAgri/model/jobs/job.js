const mongoose = require("mongoose");
const { otherFacilitiesSchema } = require("../others/other_facilities");
const Schema = mongoose.Schema;
const jobSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    cropId: {
      type: Schema.Types.ObjectId,
      ref: "cropCalendar",
      required: true,
    },
    farmName: { type: String, required: true },
    farmId: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    image: { type: String, required: true },
    status: { type: Number, default: 0 },
    distance: { type: Number, required: true },
    maleCount: { type: Number, required: true },
    femaleCount: { type: Number, required: true },
    maleSalary: { type: Number, required: true },
    femaleSalary: { type: Number, required: true },
    availMale: { type: Number, required: true },
    availFemale: { type: Number, required: true },
    extra: { type: Number, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    duration: { type: Number, required: true },
    otherFacilities: { type: [otherFacilitiesSchema] },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobDescription: {
      type: String,
      maxlength: [2500, "Job description cannot exceed 2500 characters"],
    },
  },

  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
